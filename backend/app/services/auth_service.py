from werkzeug.security import check_password_hash,generate_password_hash
from flask_login import login_user, logout_user, current_user

from app.models.postgres_models import db, User

def register_user(username, password, email):
    # Check if user exists (you need to implement this check based on your database)
    # if user_exists(username, email):
    #     return False, "User already exists"

    # Hash password for secure storage
    hashed_password = generate_password_hash(password)

    # Create and save new user to database
    # save_user(username, hashed_password, email)

    return True, "User successfully registered"


def authenticate_user(username, password):
    """
    Authenticate the user by their username and password.
    Returns True if authentication is successful, False otherwise.
    """
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        login_user(user, remember=True)
        return True
    return False

def logout():
    """
    Log out the current user.
    """
    logout_user()
