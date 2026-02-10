from flask import Flask
from flask_cors import CORS
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    # Register blueprints
    from routes.policy_routes import policy_bp
    from routes.risk_routes import risk_bp
    from routes.pricing_routes import pricing_bp
    from routes.prompt_routes import prompt_bp
    from routes.file_routes import file_bp
    from routes.chatbot_routes import chatbot_bp

    app.register_blueprint(policy_bp, url_prefix='/api/policies')
    app.register_blueprint(risk_bp, url_prefix='/api/risk')
    app.register_blueprint(pricing_bp, url_prefix='/api/pricing')
    app.register_blueprint(prompt_bp, url_prefix='/api/prompts')
    app.register_blueprint(file_bp, url_prefix='/api/files')
    app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')

    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
