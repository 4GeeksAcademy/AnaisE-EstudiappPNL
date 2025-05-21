from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, ForeignKey, TIMESTAMP, func 
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users' 

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(300), nullable=False)
    username: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    rol: Mapped[str] = mapped_column(String(10), nullable=True) 
    test_results: Mapped[list["TestResult"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        lazy=True
    )

    def set_password(self, password):
        from werkzeug.security import generate_password_hash
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        serialized_test_results = []
    
        if self.test_results:
            for result in self.test_results:
                serialized_test_results.append({
                    "id": result.id,
                    "dominant_channel": result.dominant_channel,
                    "created_at": result.created_at.isoformat() if result.created_at else None
                })

        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "rol": self.rol,
            "test_results": serialized_test_results 
        }

    def __repr__(self):
       
        return f'<User {self.username}>'

class Question(db.Model): 
    __tablename__ = 'questions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    question: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    option_v: Mapped[str] = mapped_column(String(100), nullable=False)
    option_a: Mapped[str] = mapped_column(String(120), nullable=False)
    option_k: Mapped[str] = mapped_column(String(120), nullable=False)
    order: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)

    user_answers: Mapped[list["UserAnswer"]] = relationship(
        back_populates="question",
        lazy=True
    )

    def serialize(self):
        
        return {
            "id": self.id,
            "question": self.question,
            "option_v": self.option_v, 
            "option_a": self.option_a,
            "option_k": self.option_k,
            "order": self.order,
        }

    def __repr__(self):
        return f'<Question {self.order}: {self.question}>'
    

    class UserAnswer(db.Model): 
    __tablename__ = 'user_answers'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    test_result_id: Mapped[int] = mapped_column(Integer, ForeignKey('test_results.id'), nullable=False)
    question_id: Mapped[int] = mapped_column(Integer, ForeignKey('questions.id'), nullable=False)
    # Columna para guardar la opción seleccionada ('V', 'A' o 'K').
    selected_option: Mapped[str] = mapped_column(String(1), nullable=False)
    test_result: Mapped["TestResult"] = relationship(back_populates="user_answers")
    question: Mapped["Question"] = relationship(back_populates="user_answers")

    def serialize(self):
       
        return {
            "id": self.id,
            "test_result_id": self.test_result_id,
            "question_id": self.question_id,
            "selected_option": self.selected_option,
            "question_text": self.question.question if self.question else None
        }

    def __repr__(self):
        return f'<UserAnswer TestResult {self.test_result_id} Q:{self.question_id} Opt:{self.selected_option}>'


class TestResult(db.Model):
    __tablename__ = 'test_results'
   
    id: Mapped[int] = mapped_column(Integer, primary_key=True) # Especifica Integer
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False) # Especifica Integer
    dominant_channel: Mapped[str] = mapped_column(String(1), nullable=False) # 'V', 'A' o 'K'
    created_at: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
    user: Mapped["User"] = relationship(back_populates="test_results")
    user_answers: Mapped[list["UserAnswer"]] = relationship(
        back_populates="test_result",
        cascade="all, delete-orphan",
        lazy=True
    )

    def serialize(self):
        serialized_answers = []
        if self.user_answers:
            for answer in self.user_answers:
                serialized_answers.append({
                    "question_id": answer.question_id,
                    "selected_option": answer.selected_option, # Esto devolverá 'V', 'A' o 'K'
                })

        return {
            "id": self.id,
            "user_id": self.user_id,
            "dominant_channel": self.dominant_channel,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "user_answers": serialized_answers 
        }

    def __repr__(self):
       
        return f'<TestResult for User {self.user_id} - Channel: {self.dominant_channel}>'








