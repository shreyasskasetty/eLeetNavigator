import os
from datetime import timedelta

class Config:
    """Base configuration class. Contains default settings."""
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    CORS_HEADERS = 'content-type'
    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    MONGO_URI = os.getenv('MONGO_URI')

class DevelopmentConfig(Config):
    """Development configuration class. Overrides some defaults."""
    DEBUG = True
    SQLALCHEMY_ECHO = True
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MONGO_URI = os.getenv('MONGO_URI')
    PERMANENT_SESSION_LIFETIME = timedelta(days=365)
    MONGODB_SETTINGS: dict = {
        'db': 'eLeetNavigator',
        'host': 'localhost',
        'port': 27017
    }

class TestingConfig(Config):
    """Testing configuration class. Overrides some defaults for testing."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv('TEST_DATABASE_URL')
    MONGODB_URI = os.getenv('TEST_MONGODB_URI')

class ProductionConfig(Config):
    """Production configuration class. Uses different defaults."""
    DEBUG = False
    SQLALCHEMY_ECHO = False

