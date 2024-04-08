from werkzeug.security import check_password_hash,generate_password_hash
from flask_login import login_user, logout_user, current_user

from app.models.mongodb_models import db, User

def register_user(username, password, email):
    existing_user = User.objects(username=username).first() or User.objects(email=email).first()
    print("existing user:",existing_user)
    if existing_user:
        return False, "Username or email already exists"
    
    hashed_password = generate_password_hash(password)
    user = User(username=username, email=email, password=hashed_password).save()
    
    return True, "Registration successful"


def authenticate_user(username, password):
    """
    Authenticate the user by their username and password.
    Returns True if authentication is successful, False otherwise.
    """
    user = User.objects(username=username).first()
    if user and check_password_hash(user.password, password):
        login_user(user)
        return True
    return False

def logout():
    """
    Log out the current user.
    """
    logout_user()
