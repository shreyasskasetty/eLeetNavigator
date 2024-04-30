from datetime import datetime
from flask import jsonify
from app.models.mongodb_models import UserInfo, User, History
import traceback

RETRY_LIMIT = 3

def create_user(userId: str, emailId: str, name: str='', imageUrl: str='', username: str='')->tuple[bool, User]:
    if not userId or not emailId:  # Ensuring required fields are not empty
        return False, None
    newUser = User()
    newUser.emailId = emailId
    newUser.userId = userId
    newUser.name = name
    newUser.imageUrl = imageUrl
    if username:
        newUser.username = username
    
    try:
        new_user_info = newUser.save()
        return True, new_user_info
    except Exception as e:
        print(e)
        return False, None
        
def check_user_exists(userId: str) -> tuple[bool, User]:
    if not userId:
        return False, None
    
    user = User.objects(userId=userId).first()
    if not user:
        return False, None

    return True, user

def update_username(userId: str, username: str) -> bool:
    exists, user = check_user_exists(userId)

    if not exists:
        print('User does not exist')
        return False
    
    user.username = username

    try:
        user.save()
        return True
    except Exception as e:
        print(e)
        return False

def get_user_info_exists(userId: str)-> tuple[bool,UserInfo]:
    if not userId:
        return False, None
    
    user_info = UserInfo.objects(userId=userId).first()
    if not user_info:
        return False, None
    
    return True, user_info

def create_user_info(userInfo: UserInfo, retry: int):
    exists, user = check_user_exists(userInfo.userId)
    if not exists:
        print("username doesn't exist in the records. Register at the dashboard.")
        response = {"message" : "username doesn't exist in the records. Register at the dashboard."}
        return jsonify(response), 400
    
    if user.username != userInfo.username:
        print("Different user")
        response = {"message" : "Different user"}
        return jsonify(response), 400

    exists, _ = get_user_info_exists(userInfo.userId)
    if exists:
        print('User_info already exists')
        response = {"message" : "User_info already exists"}
        return jsonify(response), 400

    try:
        for history in userInfo.history[::-1]:
            history.last_update = datetime.now()
        current_timestamp = datetime.now()
        timestamp_string = current_timestamp.strftime("%Y-%m-%d %H:%M:%S")
        user.userInfoUpdatedTs = timestamp_string
        new_user_info = userInfo.save()
        user.save()
        response = {"message" : "Added Successfully"}
        return jsonify(response) , 200
    except Exception as e:
        print(e)
        if retry > RETRY_LIMIT:
            response = {"message" : "Failed to add"}
            return jsonify(response) , 400
        else:
            return create_user_info(userInfo, retry + 1)

def update_user_info(updatedUserInfo: UserInfo, retry : int):
    exists, user_info = get_user_info_exists(updatedUserInfo.userId)

    if not exists:
        return create_user_info(updatedUserInfo, retry)
    
    if user_info.username != updatedUserInfo.username:
        print('Unauthorized user update')
        response = {"message" : "Unauthorized user update"}
        return jsonify(response), 400 
    
    exists, user = check_user_exists(updatedUserInfo.userId)

    user_info.languages = updatedUserInfo.languages
    user_info.rank = updatedUserInfo.rank
    user_info.streak = updatedUserInfo.streak
    user_info.skills = updatedUserInfo.skills
    user_info.solved_problems = updatedUserInfo.solved_problems

    try:
        current_timestamp = datetime.now()
        timestamp_string = current_timestamp.strftime("%Y-%m-%d %H:%M:%S")
        user.userInfoUpdatedTs = timestamp_string
        user.save()
        user_info.save()
        response = {"message" : "Updated Successfully"}
        return jsonify(response) , 200
    except Exception as e:
        if retry > RETRY_LIMIT:
            response = {"message" : "Updated Failed"}
            return jsonify(response) , 400
        else:
            return update_user_info(updatedUserInfo, retry + 1)  

def update_problem_log(userId:str, history:History, retry:int):
    if not userId:
        response = {"message" : "User name can't be empty."}
        return jsonify(response), 404
    
    if not history:
        response = {"message" : "Invalid history payload."}
        return jsonify(response), 404
    
    exists, user_info = get_user_info_exists(userId)

    if not exists:
        response = {"message" : "User doesn't exist in the system."}
        return jsonify(response), 404

    problem_id = history.problem_id

    problem_history = next((log for log in user_info.history if log.problem_id == problem_id ), None)

    if problem_history is None:
        history.last_update = datetime.now()
        user_info.history.append(history)
    else:
        for log in history.problem_log:
            problem_history.problem_log.append(log)

        problem_history.last_update = datetime.now()
    try:
        user_info.save()
        response = {"message" : "Update Successful."}
        return jsonify(response), 200
    except Exception as e:
        if retry > RETRY_LIMIT:
            print(traceback.format_exc())
            response = {"message" : "Update Failed"}
            return jsonify(response), 400
        else:
            return update_problem_log(userId, history, retry + 1)
    
def get_user_stats(user_id : str):
    exists, user_info = get_user_info_exists(user_id)

    if not exists:
        print("username doesn't exist in the records. Register at the dashboard.")
        response = {"message" : "username doesn't exist in the records. Register at the dashboard."}
        return jsonify(response), 400
    
    user_info.history = None
    user_stats = {}
    user_stats['rank'] = user_info.rank
    user_stats['total'] = 0
    for prob in user_info.solved_problems:
        user_stats['total'] += prob.count
        user_stats[prob.type] = prob.count 
    user_stats['easy_total'] = 790
    user_stats['medium_total'] = 1646
    user_stats['hard_total'] = 698

    return jsonify(user_stats), 200

def get_user_history(user_id : str, limit):
    exists, user_info = get_user_info_exists(user_id)

    if not exists:
        print("username doesn't exist in the records. Register at the dashboard.")
        response = {"message" : "username doesn't exist in the records. Register at the dashboard."}
        return jsonify(response), 400
    
    most_recent_history = sorted(user_info.history, key=lambda x: x.last_update, reverse=True)
    return_length = min(limit, len(most_recent_history))
    recent_history = []
    for history in most_recent_history[:return_length]:
        log = {}
        log['problem_id'] = history.problem_id
        log['accepted'] = history.problem_log[0].accepted
        log['runtime'] = history.problem_log[0].runtime
        log['memory'] = history.problem_log[0].memory
        log['time_beats'] = history.problem_log[0].time_beats
        log['memory_beats'] = history.problem_log[0].memory_beats
        recent_history.append(log)

    return jsonify(recent_history), 200
