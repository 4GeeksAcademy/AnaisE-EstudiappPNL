"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from api.models import db, User, Question # Asegúrate de que otros modelos (Question, TestResult, UserAnswer) también estén aquí si los usas en otras rutas
from api.utils import generate_sitemap, APIException # Asumo que APIException es la clase correcta de utils
from flask_cors import CORS
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
import os
import json # Necesario si vas a usar el endpoint de carga de preguntas desde JSON aquí
from api.models import db, User, Question, TestResult, UserAnswer 


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({
        "message": "Hello! I'm a message that came from the backend"
    }), 200

# RUTA DE REGISTRO (FUNCIONANDO)
@api.route('/register', methods=['POST'])
def register_user():
    # Las líneas de print son útiles para depuración, pero puedes quitarlas en producción
    # print("Headers:", dict(request.headers))
    # print("Content-Type:", request.content_type)
    # print("Body crudo:", request.data)

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No se recibió un JSON válido"}), 400

    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not email or not username or not password:
        return jsonify({"msg": "Email, username y password son requeridos"}), 400

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

    return jsonify({"msg": "Usuario registrado exitosamente", "user_id": new_user.id}), 201


# --- RUTA DE LOGIN (FALTABA EN TU CÓDIGO) ---
@api.route('/login', methods=['POST'])
def login_user():
    identifier = request.json.get('identifier', None)
    password = request.json.get('password', None)

    if not identifier or not password:
        return jsonify({"msg": "Identificador y password son requeridos"}), 400

    user = db.session.execute(
        db.select(User).filter((User.email == identifier) | (User.username == identifier))
    ).scalar_one_or_none()

    if user is None or not user.check_password(password):
        return jsonify({"msg": "Email/Usuario o contraseña incorrectos"}), 401

    access_token = create_access_token(identity=str(user.id)) # Asegúrate de que identity sea serializable
    
    return jsonify(access_token=access_token, user=user.serialize()), 200
# --- FIN RUTA DE LOGIN ---


@api.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    print("\n--- Entrando a la ruta /dashboard ---")
    try:
        print("Decorador @jwt_required() procesado. Intentando obtener identidad del JWT...")
        
        current_user_id = int(get_jwt_identity())
        
        print(f"ID de usuario obtenido del JWT: {current_user_id}")
        print(f"Tipo de ID de usuario: {type(current_user_id)}")

        user = db.session.execute(
            db.select(User).filter_by(id=current_user_id)
        ).scalar_one_or_none()

        if user is None:
            print(f"ERROR: Usuario con ID {current_user_id} no encontrado en la DB.")
            return jsonify({"msg": "Usuario no encontrado"}), 404

        print(f"Usuario encontrado en DB: {user.username} (ID: {user.id})")
        
        user_has_completed_test = getattr(user, 'has_completed_test', False) 

        return jsonify({
            "msg": f"Bienvenido al dashboard, {user.username}!",
            "user_data": user.serialize(),
            "has_completed_test": user_has_completed_test 
        }), 200

    except Exception as e:
        print(f"ERROR INESPERADO en la ruta /dashboard: {e}")
        return jsonify({
            "msg": "Error interno del servidor al acceder al dashboard",
            "details": str(e)
            }), 500

@api.route('/questions', methods=['GET'])
def get_all_questions():
    questions = Question.query.all()
    if not questions:
        return jsonify({"msg": "No hay preguntas disponibles"}), 404
    serialized_questions = [question.serialize() for question in questions]
    return jsonify(serialized_questions), 200

@api.route('/submit-test-answers', methods=['POST'])
@jwt_required()
def submit_test_answers():
    current_user_id = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(id=current_user_id)).scalar_one_or_none()
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    data = request.get_json()
    answers_data = data.get('answers')
    if not answers_data or not isinstance(answers_data, dict):
        return jsonify({"msg": "Datos de respuestas inválidos o incompletos"}), 400

    try:
        scores = {'V': 0, 'A': 0, 'K': 0}

        db.session.query(UserAnswer).filter(UserAnswer.test_result.has(user_id=user.id)).delete()
        db.session.query(TestResult).filter_by(user_id=user.id).delete()
        db.session.commit()

        # ✅ Inicializar el test result con canal neutro "N"
        new_test_result = TestResult(user_id=user.id, dominant_channel="N")
        db.session.add(new_test_result)
        db.session.flush()

        for q_id_str, selected_option_char in answers_data.items():
            try:
                question_id = int(q_id_str)
            except ValueError:
                print(f"Advertencia: question_id inválido recibido: {q_id_str}. Saltando.")
                continue

            # ✅ Validar que la pregunta exista
            question = db.session.get(Question, question_id)
            if not question:
                print(f"Advertencia: pregunta con ID {question_id} no encontrada. Saltando.")
                continue

            if selected_option_char in scores:
                scores[selected_option_char] += 1
                new_user_answer = UserAnswer(
                    test_result_id=new_test_result.id,
                    question_id=question_id,
                    selected_option=selected_option_char
                )
                db.session.add(new_user_answer)
            else:
                print(f"Advertencia: Opción seleccionada inválida '{selected_option_char}' para pregunta {question_id}. Saltando.")

        if any(scores.values()):
            dominant_channel = max(scores, key=scores.get)
            new_test_result.dominant_channel = dominant_channel
            user.learning_channel = dominant_channel

        db.session.commit()

        return jsonify({
            "msg": "Respuestas del test guardadas y canal dominante calculado exitosamente.",
            "dominant_channel": new_test_result.dominant_channel,
            "test_result_id": new_test_result.id
        }), 200

    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({"msg": "Error interno del servidor al procesar el test", "details": str(e)}), 500


