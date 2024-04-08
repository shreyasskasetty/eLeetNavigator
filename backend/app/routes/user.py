from flask import Blueprint, render_template,request

# Import any necessary services or models

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile')
def profile():
    # Assume we have a function to get user info
    # user_info = get_user_info(current_user.id)
    return render_template('profile.html')  # , user=user_info)

# @user_bp.route('/recommendations', methods=['GET'])
# def recommendations():

@user_bp.route('/dashboard')
def dashboard():
    # Assume we have a function to get user info
    # user_info = get_user_info(current_user.id)
    return render_template('dashboard.html')  # , user=user_info)
        
