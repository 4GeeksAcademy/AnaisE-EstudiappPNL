from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()
#tablas: usuario, test, canales, recomendacion 
class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    #is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    user_name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    resultado_test: Mapped[str] = mapped_column(String(50), unique=False, nullable=True)
    nombre: Mapped[str] = mapped_column(String(30), unique=False, nullable=True) 
    apellido: Mapped[str] = mapped_column(String(30), unique=False, nullable=True)
    rol: Mapped[str] = mapped_column(String(10), unique=False, nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "resultado_test": self.resultado_test,
            "user_name": self.user_name,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "rol": self.rol,
        }
    
class Test(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    pregunta: Mapped[str] = mapped_column(String(500))
    respuesta_1: Mapped[str] = mapped_column(String(500))
    respuesta_2: Mapped[str] = mapped_column(String(500))
    respuesta_3: Mapped[str] = mapped_column(String(500))
    respuesta_1_canal: Mapped[str]= mapped_column(String(30))
    respuesta_2_canal: Mapped[str]= mapped_column(String(30))
    respuesta_3_canal: Mapped[str]= mapped_column(String(30))

    def serialize(self):
        return {
            "id": self.id,
            "pregunta": self.pregunta,
            "respuesta_1": self.respuesta_1,
            "respuesta_2": self.respuesta_2,
            "respuesta_3": self.respuesta_3,
            "respuesta_1_canal": self.respuesta_1_canal,
            "respuesta_2_canal": self.respuesta_2_canal,
            "respuesta_3_canal": self.respuesta_3_canal,
        }
    

class Canales(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    visual: Mapped[str] = mapped_column(String(30))
    auditivo: Mapped[str] = mapped_column(String(30))
    kinestesico: Mapped[str] = mapped_column(String(30))

    def serialize(self):
        return {
            "id": self.id,
            "visual": self.visual,
            "auditivo": self.auditivo,
            "kinestesico": self.kinestesico,
        }
    
class Recomendacion(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    visual: Mapped[str] = mapped_column(String(500))
    auditivo: Mapped[str] = mapped_column(String(500))
    kinestesico: Mapped[str] = mapped_column(String(500))

    def serialize(self):
        return {
            "id": self.id,
            "visual": self.visual,
            "auditivo": self.auditivo,
            "kinestesico": self.kinestesico,
            }
