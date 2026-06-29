"""GlobalHire Flask application entry point."""

import sys
from pathlib import Path

from flask import Flask, send_from_directory
from flask_cors import CORS

BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from config import Config
from db.connection import init_pool
from routes.api import api_bp


def create_app() -> Flask:
    app = Flask(__name__, static_folder=None)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGINS}})

    app.register_blueprint(api_bp)

    try:
        init_pool()
    except Exception:
        pass

    @app.route("/")
    def serve_home():
        return send_from_directory(Config.FRONTEND_DIR, "index.html")

    @app.route("/<path:filepath>")
    def serve_static(filepath: str):
        return send_from_directory(Config.FRONTEND_DIR, filepath)

    return app


app = create_app()

if __name__ == "__main__":
    init_pool()
    app.run(host="0.0.0.0", port=5000, debug=Config.DEBUG)
