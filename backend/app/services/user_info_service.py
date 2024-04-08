from app.models.mongodb_models import UserInfo, User

def check_user_exists(username: str):
    if not username:
        return False, None
    
    user = User.objects(username=username).first()
    if not user:
        return False, None

    return True, user

def check_user_info_exists(username: str)-> tuple[bool,User]:
    if not username:
        return False, None
    
    user_info = UserInfo.objects(username=username).first()
    print(user_info)
    if not user_info:
        print("user info deosn't exists")
        return False, None
    
    print("user info exists")
    return True, user_info

def create_user_info(userInfo: UserInfo):
    exists, user = check_user_exists(userInfo.username)
    if not exists:
        return "Username doesn't exist in the records. Register at the dashboard.", 400
    

    exists, _ = check_user_info_exists(userInfo.username)
    if exists:
        return "User_info already exists", 400

    userInfo.emailId = user.email
    new_user_info = userInfo.save()

    return "Added Successfully", 200
    