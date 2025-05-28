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
    test_result: Mapped[str] = mapped_column(String(1), nullable=True)
        

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











