import os
from app import create_app

from config import DevelopmentConfig, ProductionConfig


config_name = os.getenv('FLASK_CONFIG', 'development')
if config_name.lower() == 'production':
    config_class = ProductionConfig
else:
    config_class = DevelopmentConfig

app = create_app(config_class)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3000, debug=config_class.DEBUG)
