import React, { useState, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext'; 
import "../../styles/home.css"; 

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    
    const { actions } = useContext(Context);

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "username") {
            setUsername(value);
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault(); 

        console.log("Componente Register: Intentando registrar usuario:", { username, email, password });

        
        const result = await actions.register(email, username, password); // Pasa los datos a la acción de Flux

        if (result.success) {
            console.log("Componente Register: Registro exitoso:", result.data);
            alert("¡Registro exitoso! Ahora puedes iniciar sesión."); 
        } else {
            console.error("Componente Register: Error en el registro:", result.message);
            alert(`Error al registrar: ${result.message}`);
        }
    };

    return (
        <div className='body-register'>
            <h2 className='my-5'>Regístrate para identificar tu canal de Aprendizaje</h2>
                <form className="form m-auto my-5" onSubmit={handleSubmit}>
                    <div className="input-field">
                        <input
                            required
                            autoComplete="off"
                            type="text"
                            name="username"
                            id="username" 
                            value={username}
                            onChange={handleChange}
                        />
                        <label htmlFor="username">Nombre de Usuario</label>
                    </div>
                    <div className="input-field">
                        <input
                            required
                            autoComplete="off"
                            type="email"
                            name="email"
                            id="email" 
                            value={email}
                            onChange={handleChange}
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="input-field">
                        <input
                            required
                            autoComplete="off"
                            type="password"
                            name="password"
                            id="password" 
                            value={password}
                            onChange={handleChange}
                        />
                        <label htmlFor="password">Contraseña</label> 
                    </div>
                    <div className="btn-container">
                        <button className="btn" type="submit">Enviar</button>
                        <div className="acc-text">
                           Si ya tienes un cuenta {" "} 
                            <span
                                style={{ color: '#0000ff', cursor: 'pointer' }}
                                onClick={() => navigate("/login")} // Redirige al login al hacer clic
                            >
                                Inicia sesión
                            </span>
                        </div>
                    </div>
                </form>
            
        </div>
    );
};

export default Register;