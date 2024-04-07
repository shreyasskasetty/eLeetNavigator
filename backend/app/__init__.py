from flask import Flask
from flask_login import LoginManager
from config import DevelopmentConfig  # Or dynamically choose based on an environment variable
from app.routes.auth import auth_bp
from app.routes.user import user_bp
from app.models.postgres_models import db
from app.models.postgres_models import db, User

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)
    db.init_app(app)
    
    print(app.config['SQLALCHEMY_DATABASE_URI'])
    
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'  # Specify the route for non-authenticated users
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Initialize other components (database, blueprints, etc.) here
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/user')

    return app
