from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()
#tablas: usuario, test, canales, recomendacion 
class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(300),nullable=False)
    username: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    test_result: Mapped[str] = mapped_column(String(50), nullable=True)
    rol: Mapped[str] = mapped_column(String(10), unique=False, nullable=True)

    test_result: Mapped["TestResult"]= db.relationship(back_populates="user",cascade="all,delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "test_result": self.test_result,
            "username": self.username,
            "rol": self.rol,

        }
    
    def __repr__(self):
        return self.username
    

class TestResult(db.Model):
    __tablename__ = 'test_results'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(db.ForeignKey('users.id'), nullable=False)
    #answers = mapped_column(JSON)  # Almacena las respuestas del usuario como un diccionario JSON
    dominant_channel: Mapped[str]= mapped_column(String(1), nullable=False) # 'V', 'A' o 'K'
    
    user: Mapped ["User"] = db.relationship(back_populates="test_result")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "answers": self.answers,
            "dominant_channel": self.dominant_channel,
        }

    def __repr__(self):
        return f'<TestResult for User {self.user_id} - Channel: {self.dominant_channel}>' 

    
