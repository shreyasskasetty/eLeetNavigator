import os

class Config:
    """Base configuration class. Contains default settings."""
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    MONGODB_URI = os.getenv('MONGODB_URI')

class DevelopmentConfig(Config):
    """Development configuration class. Overrides some defaults."""
    DEBUG = True
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class TestingConfig(Config):
    """Testing configuration class. Overrides some defaults for testing."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv('TEST_DATABASE_URL')
    MONGODB_URI = os.getenv('TEST_MONGODB_URI')

class ProductionConfig(Config):
    """Production configuration class. Uses different defaults."""
    DEBUG = False
    SQLALCHEMY_ECHO = False

