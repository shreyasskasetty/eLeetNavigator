from flask import Flask
from flask_login import LoginManager
from flask_pymongo import PyMongo
from config import DevelopmentConfig  # Or dynamically choose based on an environment variable
from app.routes.auth import auth_bp
from app.routes.user import user_bp
# from flask_migrate import Migrate

# from app.models.postgres_models import db
# from app.models.postgres_models import db, User

from app.models.mongodb_models import db, User

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)
    db.init_app(app)
    mongo = PyMongo(app)

    # print("Initializing Flask-Migrate...")
    # migrate = Migrate(app, db)
    # print("Flask-Migrate initialized.")
    
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'  # Specify the route for non-authenticated users
    
    # shell context for flask cli
    @app.shell_context_processor
    def ctx():
        return {'app': app, 'db': db}
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.objects(pk=user_id).first()
    
    # Initialize other components (database, blueprints, etc.) here
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/user')

    return app