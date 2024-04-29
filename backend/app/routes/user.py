from flask import Blueprint, render_template,request, session, jsonify
from flask_cors import cross_origin
from functools import wraps


# Import any necessary services or models
from app.services.user_info_service import *
from app.models.mongodb_models import UserInfo, History
from app.services.recommedation_service import get_recommendation, get_decor_recommendation

user_bp = Blueprint('user', __name__)


def check_user_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function



@user_bp.route('/profile')
def profile():
    # Assume we have a function to get user info
    # user_info = get_user_info(current_user.id)
    return render_template('profile.html')  # , user=user_info)

@user_bp.route('/recommendations', methods=['GET'])
@cross_origin()
@check_user_auth
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
@check_user_auth
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
@check_user_auth
def populate_user_info():
    user_data = request.get_json()
    user_info = UserInfo(**user_data)
    message, code = update_user_info(user_info, 1)
    if code == 200:
        session['user_info_exists'] = True
    return message, code

@user_bp.route('/problemLog', methods=['POST'])
@check_user_auth
def problem_log():
    user_id = request.args.get('user_id')
    history_data = request.get_json()
    print(history_data)
    print(user_id)
    history = History(**history_data)
    return update_problem_log(user_id, history, 1)

@user_bp.route('/userStats', methods=['GET'])
@check_user_auth
def user_stats():
    user_id = request.args.get('user_id')
    return get_user_stats(user_id)

@user_bp.route('/userRecent', methods=['GET'])
# @check_user_auth
def userRecents():
    user_id = request.args.get('user_id')
    limit = request.args.get('limit')
    if limit:
        limit = int(limit)
    else:
        limit = 15
    return get_user_history(user_id, limit)