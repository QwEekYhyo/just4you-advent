from flask import Blueprint, current_app, request, jsonify

from argon2.exceptions import VerifyMismatchError

from jwt_utils import generate_token
from middlewares import admin_required, token_required
from models import User, Calendar

auth_bp = Blueprint("auth", __name__, url_prefix="/api")


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Username and password are required"}), 400

    Session = current_app.config["DB_SESSION"]
    ph = current_app.config["PASSWORD_HASHER"]

    session = Session()
    try:
        # Find user
        user = session.query(User).filter_by(username=data["username"]).first()

        if not user:
            # Hash password to prevent timing attack
            ph.hash(data["password"])
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


@auth_bp.route("/register", methods=["POST"])
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

    Session = current_app.config["DB_SESSION"]
    ph = current_app.config["PASSWORD_HASHER"]

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


@auth_bp.route("/me", methods=["GET"])
@token_required
def me():
    Session = current_app.config["DB_SESSION"]

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
