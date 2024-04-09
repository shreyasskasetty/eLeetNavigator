from flask import Blueprint, render_template,request

# Import any necessary services or models
from app.services.user_info_service import create_user_info
from app.models.mongodb_models import UserInfo
from app.services.recommedation_service import get_recommendation



user_bp = Blueprint('user', __name__)

@user_bp.route('/profile')
def profile():
    # Assume we have a function to get user info
    # user_info = get_user_info(current_user.id)
    return render_template('profile.html')  # , user=user_info)

@user_bp.route('/recommendations', methods=['GET'])
def recommendations():
    user = request.args.get('username')
    return get_recommendation(username=user)

@user_bp.route('/dashboard')
def dashboard():
    # Assume we have a function to get user info
    # user_info = get_user_info(current_user.id)
    return render_template('dashboard.html')  # , user=user_info)

@user_bp.route('/userInfo' , methods=['POST'])
def populate_user_info():
    user_data = request.get_json()
    new_user = UserInfo(**user_data)
    return create_user_info(new_user)
        
