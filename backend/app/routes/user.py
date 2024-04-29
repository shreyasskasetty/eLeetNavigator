from flask import Blueprint, render_template,request, session
from flask_cors import cross_origin

# Import any necessary services or models
from app.services.user_info_service import create_user_info, update_problem_log, update_user_info
from app.models.mongodb_models import UserInfo, History
from app.services.recommedation_service import get_recommendation, get_decor_recommendation



user_bp = Blueprint('user', __name__)

@user_bp.route('/profile')
def profile():
    # Assume we have a function to get user info
    # user_info = get_user_info(current_user.id)
    return render_template('profile.html')  # , user=user_info)

@user_bp.route('/recommendations', methods=['GET'])
@cross_origin()
def recommendations():
    userId = request.args.get('user_id')
    limit = request.args.get('limit')
    if not limit:
        limit = 10
    else:
        limit = int(limit)
    return get_recommendation(userId=userId, limit=limit)


@user_bp.route('/decorRecommendation', methods=['GET'])
@cross_origin()
def decorRecommendation():
    userId = request.args.get('user_id')
    limit = request.args.get('limit')
    if not limit:
        limit = 10
    else:
        limit = int(limit)
    return get_decor_recommendation(user_id=userId, limit=limit)

@user_bp.route('/dashboard')
def dashboard():
    # Assume we have a function to get user info
    # user_info = get_user_info(current_user.id)
    return render_template('dashboard.html')  # , user=user_info)

@user_bp.route('/userInfo' , methods=['POST'])
def populate_user_info():
    user_data = request.get_json()
    user_info = UserInfo(**user_data)
    message, code = update_user_info(user_info, 1)
    if code == 200:
        session['user_info_exists'] = True
    return message, code

@user_bp.route('/problemLog', methods=['POST'])
def problem_log():
    user_id = request.args.get('user_id')
    history_data = request.get_json()
    print(history_data)
    print(user_id)
    history = History(**history_data)
    return update_problem_log(user_id, history, 1)