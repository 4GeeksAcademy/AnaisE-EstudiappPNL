import React, { useState, useContext } from 'react'; // Importa useContext
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext'; // Asegúrate de que esta ruta sea correcta
import "../../styles/home.css"; // Asegúrate de que la ruta a tus estilos sea correcta

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Acceder a las acciones de Flux
    const { actions } = useContext(Context);

    // Función para manejar los cambios en los inputs
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

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario

        console.log("Componente Register: Intentando registrar usuario:", { username, email, password });

        // Llamar a la acción 'register' de Flux
        const result = await actions.register(email, username, password); // Pasa los datos a la acción de Flux

        if (result.success) {
            console.log("Componente Register: Registro exitoso:", result.data);
            alert("¡Registro exitoso! Ahora puedes iniciar sesión."); // Mensaje de éxito
            navigate("/login"); // Redirige al usuario a la página de login
        } else {
            console.error("Componente Register: Error en el registro:", result.message);
            alert(`Error al registrar: ${result.message}`); // Muestra el mensaje de error del backend
        }
    };

    return (
        <div>
            <div className="container">
                <div className="heading">Sign up for your account</div> {/* Cambiado a "Sign up" para registro */}
                <form className="form" onSubmit={handleSubmit}>
                    <div className="input-field">
                        <input
                            required
                            autoComplete="off"
                            type="text"
                            name="username"
                            id="username" // Añadido id para htmlFor
                            value={username}
                            onChange={handleChange}
                        />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="input-field">
                        <input
                            required
                            autoComplete="off"
                            type="email"
                            name="email"
                            id="email" // Añadido id para htmlFor
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
                            id="password" // Añadido id para htmlFor
                            value={password}
                            onChange={handleChange}
                        />
                        <label htmlFor="password">Password</label> {/* Corregido htmlFor a "password" */}
                    </div>
                    <div className="btn-container">
                        <button className="btn" type="submit">Submit</button>
                        <div className="acc-text">
                            Already have an account?{" "} {/* Texto más apropiado para registro */}
                            <span
                                style={{ color: '#0000ff', cursor: 'pointer' }}
                                onClick={() => navigate("/login")} // Redirige al login al hacer clic
                            >
                                Sign In
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;