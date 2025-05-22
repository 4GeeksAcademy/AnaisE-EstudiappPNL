"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

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

@api.route('/login', methods=['POST'])
def login_user():
    # Puedes permitir login por email o username
    identifier = request.json.get('identifier', None) # Podría ser email o username
    password = request.json.get('password', None)

    if not identifier or not password:
        return jsonify({"msg": "Identificador y password son requeridos"}), 400

    # Buscar usuario por email o username
    user = db.session.execute(db.select(User).filter((User.email == identifier) | (User.username == identifier))).scalar_one_or_none()

    if user is None or not user.check_password(password):
        return jsonify({"msg": "Email/Usuario o contraseña incorrectos"}), 401

    # Crear el token de acceso
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token, user=user.serialize()), 200

@api.route('/dashboard', methods=['GET'])
@jwt_required() # Protege esta ruta, requiere un token JWT válido
def dashboard():
    # Acceder a la identidad del usuario actual (el ID del usuario que está en el token)
    current_user_id = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(id=current_user_id)).scalar_one_or_none()

    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    # Puedes devolver la información serializada del usuario
    return jsonify({"msg": f"Bienvenido al dashboard, {user.username}!", "user_data": user.serialize()}), 200
