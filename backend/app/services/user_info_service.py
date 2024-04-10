from flask import jsonify
from app.models.mongodb_models import UserInfo, User, History

def check_user_exists(username: str):
    if not username:
        return False, None
    
    user = User.objects(username=username).first()
    if not user:
        return False, None

    return True, user

def get_user_info_exists(username: str)-> tuple[bool,UserInfo]:
    if not username:
        return False, None
    
    user_info = UserInfo.objects(username=username).first()
    if not user_info:
        return False, None
    
    return True, user_info

def create_user_info(userInfo: UserInfo):
    exists, user = check_user_exists(userInfo.username)
    if not exists:
        response = {"message" : "Username doesn't exist in the records. Register at the dashboard."}
        return jsonify(response), 400
    

    exists, _ = get_user_info_exists(userInfo.username)
    if exists:
        response = {"message" : "User_info already exists"}
        return jsonify(response), 400

    userInfo.emailId = user.email
    new_user_info = userInfo.save()
    response = {"message" : "Added Successfully"}
    return jsonify(response) , 200

def update_problem_log(userName:str, history:History):
    if not userName:
        response = {"message" : "User name can't be empty."}
        return jsonify(response), 404
    
    if not history:
        response = {"message" : "Invalid history payload."}
        return jsonify(response), 404
    
    exists, user_info = get_user_info_exists(userName)

    if not exists:
        response = {"message" : "User doesn't exist in the system."}
        return jsonify(response), 404

    problem_id = history.problem_id

    problem_history = next((log for log in user_info.history if log.problem_id == problem_id ), None)

    if problem_history is None:
        user_info.history.append(history)
    else:
        for log in history.problem_log:
            problem_history.problem_log.append(log)

        problem_history.last_update = history.last_update
    try:
        user_info.save()
        response = {"message" : "Update Successful."}
        return jsonify(response), 200
    except Exception as e:
        response = {"message" : "Updated Failed"}
        return jsonify(response), 400
