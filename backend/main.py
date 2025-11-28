import os
from datetime import datetime, timezone, timedelta
from functools import wraps

from flask import Flask, request, jsonify
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import jwt

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from models import Base, User, Calendar

app = Flask(__name__)

# Configuration
app.config["SECRET_KEY"] = os.getenv(
    "SECRET_KEY", "your-secret-key-change-in-production"
)
app.config["DATABASE_URL"] = os.getenv("DATABASE_URL", "sqlite:///advent_calendar.db")
JWT_EXPIRATION_WEEKS = 13

# Initialize Argon2 password hasher
ph = PasswordHasher()

# Database setup
engine = create_engine(app.config["DATABASE_URL"])
Base.metadata.create_all(engine)
session_factory = sessionmaker(bind=engine)
Session = scoped_session(session_factory)


def bootstrap_admin():
    username = os.getenv("BOOTSTRAP_ADMIN_USERNAME")
    password = os.getenv("BOOTSTRAP_ADMIN_PASSWORD")

    if not username or not password:
        print("No bootstrap admin credentials found in environment variables")
        return

    session = Session()
    try:
        existing_user = session.query(User).filter_by(username=username).first()
        if existing_user:
            print(f"Bootstrap admin user '{username}' already exists")
            return

        # Hash password and create admin user
        hashed_password = ph.hash(password)
        admin_user = User(
            # calendar_id=calendar.id,
            username=username,
            password=hashed_password,
            name="Bootstrap Admin",
            is_admin=True,
        )
        session.add(admin_user)
        session.commit()
        print(f"Bootstrap admin user '{username}' created successfully")
    except Exception as e:
        session.rollback()
        print(f"Error creating bootstrap admin: {e}")
    finally:
        session.close()


def generate_token(user_id, username, is_admin):
    payload = {
        "user_id": user_id,
        "username": username,
        "is_admin": is_admin,
        "exp": datetime.now(timezone.utc) + timedelta(weeks=JWT_EXPIRATION_WEEKS),
        "iat": datetime.now(timezone.utc),
    }
    token = jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")
    return token


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Get token from Authorization header
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({"error": "Invalid token format"}), 401

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            # Decode token
            payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            request.current_user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated


def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        if not request.current_user.get("is_admin"):
            return jsonify({"error": "Admin privileges required"}), 403
        return f(*args, **kwargs)

    return decorated


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Username and password are required"}), 400

    session = Session()
    try:
        # Find user
        user = session.query(User).filter_by(username=data["username"]).first()

        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        # Verify password
        try:
            ph.verify(user.password, data["password"])
        except VerifyMismatchError:
            return jsonify({"error": "Invalid credentials"}), 401

        # Check if password needs rehashing (Argon2 updates over time)
        if ph.check_needs_rehash(user.password):
            user.password = ph.hash(data["password"])
            session.commit()

        # Generate token
        token = generate_token(user.id, user.username, user.is_admin)

        return (
            jsonify(
                {
                    "token": token,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "name": user.name,
                        "is_admin": user.is_admin,
                    },
                }
            ),
            200,
        )

    finally:
        session.close()


@app.route("/register", methods=["POST"])
@admin_required
def register():
    data = request.get_json()

    # Validate input
    required_fields = ["username", "password", "name", "calendar_id"]
    if not data or not all(field in data for field in required_fields):
        return (
            jsonify(
                {"error": "username, password, name, and calendar_id are required"}
            ),
            400,
        )

    session = Session()
    try:
        # Check if username already exists
        existing_user = session.query(User).filter_by(username=data["username"]).first()
        if existing_user:
            return jsonify({"error": "Username already exists"}), 409

        # Check if calendar exists
        calendar = session.query(Calendar).filter_by(id=data["calendar_id"]).first()
        if not calendar:
            return jsonify({"error": "Calendar not found"}), 404

        # Hash password
        hashed_password = ph.hash(data["password"])

        # Create new user
        new_user = User(
            calendar_id=data["calendar_id"],
            username=data["username"],
            password=hashed_password,
            name=data["name"],
            is_admin=data.get("is_admin", False),
        )

        session.add(new_user)
        session.commit()

        return (
            jsonify(
                {
                    "message": "User created successfully",
                    "user": {
                        "id": new_user.id,
                        "username": new_user.username,
                        "name": new_user.name,
                        "calendar_id": new_user.calendar_id,
                        "is_admin": new_user.is_admin,
                    },
                }
            ),
            201,
        )

    except Exception as e:
        session.rollback()
        return jsonify({"error": f"Failed to create user: {str(e)}"}), 500
    finally:
        session.close()


@app.route("/me", methods=["GET"])
@token_required
def me():
    """Get current user information."""
    session = Session()
    try:
        user = session.query(User).filter_by(id=request.current_user["user_id"]).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        return (
            jsonify(
                {
                    "id": user.id,
                    "username": user.username,
                    "name": user.name,
                    "calendar_id": user.calendar_id,
                    "is_admin": user.is_admin,
                }
            ),
            200,
        )

    finally:
        session.close()


@app.teardown_appcontext
def shutdown_session(exception=None):
    """Remove database session at the end of the request."""
    Session.remove()


if __name__ == "__main__":
    # Bootstrap admin user on startup
    bootstrap_admin()

    # Run the Flask app
    app.run(debug=True, host="0.0.0.0", port=5000)
