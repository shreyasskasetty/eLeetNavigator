import os
from app import create_app
import argparse
from constants import *
from config import DevelopmentConfig, ProductionConfig, TestingConfig

def configure_app(env):
    config_name = os.getenv('FLASK_CONFIG', env)
    if config_name.lower() == PRODUCTION:
        config_class = ProductionConfig
    elif config_name.lower() == DEVELOPMENT:
        config_class = DevelopmentConfig
    else:
        config_class = TestingConfig

    app = create_app(config_class)
    return app, config_class

if __name__ == "__main__":
    parser = argparse.ArgumentParser("run", description="Enter the required arguments")
    parser.add_argument('-e', '--env',default= 'development', choices=['development','test','production'])
    args = parser.parse_args()
    app, config_class = configure_app(args.env)
    app.run(host='0.0.0.0', port=3000, debug=config_class.DEBUG)
