"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User # Asumo que otros modelos (Question, TestResult, UserAnswer) también están aquí
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

# --- Importaciones FALTANTES para JWT ---
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
# --- FIN Importaciones FALTANTES ---

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

# --- Rutas corregidas para usar @api.route ---

@api.route('/register', methods=['POST']) 
def register_user():
    email = request.json.get('email', None)
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not email or not username or not password:
        return jsonify({"msg": "Email, username y password son requeridos"}), 400

    # Verificar si el email ya existe
    user_email_exists = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
    if user_email_exists:
        return jsonify({"msg": "El email ya está registrado"}), 409

    # Verificar si el username ya existe
    user_username_exists = db.session.execute(db.select(User).filter_by(username=username)).scalar_one_or_none()
    if user_username_exists:
        return jsonify({"msg": "El nombre de usuario ya está en uso"}), 409

    new_user = User(email=email, username=username)
    new_user.set_password(password) # Usar el método del modelo para hashear la contraseña
    new_user.rol = "student" # Asignar un rol por defecto

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario registrado exitosamente", "user_id": new_user.id}), 201

@api.route('/login', methods=['POST']) # ¡CORREGIDO: @api.route!
def login_user():
    identifier = request.json.get('identifier', None)
    password = request.json.get('password', None)

    if not identifier or not password:
        return jsonify({"msg": "Identificador y password son requeridos"}), 400

    user = db.session.execute(db.select(User).filter((User.email == identifier) | (User.username == identifier))).scalar_one_or_none()

    if user is None or not user.check_password(password):
        return jsonify({"msg": "Email/Usuario o contraseña incorrectos"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token, user=user.serialize()), 200

@api.route('/dashboard', methods=['GET']) # ¡CORREGIDO: @api.route!
@jwt_required()
def dashboard():
    current_user_id = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(id=current_user_id)).scalar_one_or_none()

    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({"msg": f"Bienvenido al dashboard, {user.username}!", "user_data": user.serialize()}), 200