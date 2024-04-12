from flask import Blueprint, request, session, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests
from flask import current_app
from functools import wraps
from app.services.user_info_service import check_user_exists, create_user

# Create a Blueprint for authentication
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/@me',methods=['GET'])
def get_current_user():
    user_id = session.get("user_id")
    new_user = session.get("new_user")
    print(user_id)

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    return jsonify({
        "userId": user_id,
        "new_user" : new_user
    })

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'Authorization' not in request.headers:
            return jsonify({'error': 'Authorization token is missing'}), 403
        try:
            auth_header = request.headers['Authorization']
            token = auth_header.split(" ")[1]  # Expected header "Authorization: Bearer <token>"
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), current_app.config["GOOGLE_CLIENT_ID"])
            print(idinfo)
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            exists, _ = check_user_exists(idinfo['sub'])

            if exists:
                session['new_user'] = False
                pass

            else:
                userId = idinfo['sub']
                emailId = idinfo['email']
                name = idinfo['name']
                imageUrl = idinfo['picture']
                status, _ = create_user(userId, emailId, name, imageUrl)

                if not status:
                    return ({'error': 'Unable to create user'}), 400
                
                session['new_user'] = True

            # Store user info in session or request context if necessary
            session['user_id'] = idinfo['sub']
            request.user_id = idinfo['sub']

        except ValueError as e:
            return jsonify({'error': 'Invalid token', 'details': str(e)}), 401
        except IndexError:
            return jsonify({'error': 'Token structure is wrong'}), 400
        except Exception as e:
            return jsonify({'error': 'Error processing token', 'details': str(e)}), 500
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/login', methods=['GET'])
@token_required
def login():
    return jsonify({'status': 'success', 
                    'userId': session.get('user_id'),
                    'new_user': session.get('new_user')}), 200


@auth_bp.route('/logout')
def logout():
    session.pop('user_id', None)
    return jsonify({'status': 'logged_out'}), 200
