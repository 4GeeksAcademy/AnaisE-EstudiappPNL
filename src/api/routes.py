"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity

api = Blueprint('api', __name__)  # CORREGIDO: __name, no _name
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({
        "message": "Hello! I'm a message that came from the backend"
    }), 200

@api.route('/register', methods=['POST'])
def register_user():
    print("Headers:", dict(request.headers))
    print("Content-Type:", request.content_type)
    print("Body crudo:", request.data)

    # Asegurar que viene JSON
    data = request.get_json()
    if not data:
        return jsonify({"msg": "No se recibió un JSON válido"}), 400

    # Extraer datos
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not email or not username or not password:
        return jsonify({"msg": "Email, username y password son requeridos"}), 400

    # Validar existencia previa en DB
    user_email_exists = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
    if user_email_exists:
        return jsonify({"msg": "El email ya está registrado"}), 409

    user_username_exists = db.session.execute(db.select(User).filter_by(username=username)).scalar_one_or_none()
    if user_username_exists:
        return jsonify({"msg": "El nombre de usuario ya está en uso"}), 409

    new_user = User(email=email, username=username)
    new_user.set_password(password)
    new_user.rol = "student"

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario registrado exitosamente", "user_id": new_user.id}),201


    

@api.route('/login', methods=['POST'])
def login_user():
    identifier = request.json.get('identifier')
    password = request.json.get('password')

    if not identifier or not password:
        return jsonify({"msg": "Identificador y password son requeridos"}), 400

    user = db.session.execute(
        db.select(User).filter((User.email == identifier) | (User.username == identifier))
    ).scalar_one_or_none()

    if user is None or not user.check_password(password):
        return jsonify({"msg": "Email/Usuario o contraseña incorrectos"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token, user=user.serialize()), 200


@api.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user_id = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(id=current_user_id)).scalar_one_or_none()

    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({
        "msg": f"Bienvenido al dashboard, {user.username}!",
        "user_data": user.serialize()}),  200