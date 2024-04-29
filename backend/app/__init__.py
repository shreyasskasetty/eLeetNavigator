from flask import Flask
from flask_login import LoginManager
from flask_pymongo import PyMongo
from config import DevelopmentConfig  # Or dynamically choose based on an environment variable
from app.routes.auth import auth_bp
from app.routes.user import user_bp
# from flask_migrate import Migrate

# from app.models.postgres_models import db
# from app.models.postgres_models import db, User
from app.components.Content_based_recommendation import ContentBased
from app.components.Recommendation_based_on_last_5 import BasedOnLastNProblems
from app.components.Recommendation_based_on_difficulty import DifficultyBasedRecommendation
from app.components.Cold_start_recommendation import ColdStartRecommendation
from app.components.Problem_decorator import ProblemDecorator
from app.models.mongodb_models import db, User
from flask import current_app
from flask_cors import CORS


def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)
    db.init_app(app)
    mongo = PyMongo(app)
    cors = CORS(app, supports_credentials=True)

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
    
    @app.before_request
    def load_recommendation_list():
        current_app.config['recom_list'] = [ContentBased(), BasedOnLastNProblems(), DifficultyBasedRecommendation()]
        current_app.config['prob_decor'] = ProblemDecorator()
        current_app.config['cold_start_recom'] = ColdStartRecommendation()

    @login_manager.user_loader
    def load_user(user_id):
        return User.objects(pk=user_id).first()
    
    # Initialize other components (database, blueprints, etc.) here
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/user')

    return app
