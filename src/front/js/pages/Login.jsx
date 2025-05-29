import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext'; // Ajusta la ruta a tu Contexto de Flux
// Asegúrate de importar useNavigate si lo usas para redirección
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { actions } = useContext(Context);
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Intentando iniciar sesión con:', { email, password });

        const result = await actions.login(email, password);
        
        if (result.success) {
            console.log('Login exitoso:', result.data);
            
            navigate('/dashboard'); 
        } else {
            console.error('Error de login:', result.message);
            
            alert(result.message);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div>
            <form className="form" onSubmit={handleSubmit}>
                <p className="form-title">Sign in to your account</p>
                
                <div className="input-container">
                    <input
                        placeholder="Enter email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    <span>
                        <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                        </svg>
                    </span>
                </div>
                
                <div className="input-container">
                    <input
                        placeholder="Enter password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    <span>
                        <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                        </svg>
                    </span>
                </div>
                
                <button className="submit" type="submit">
                    Sign in
                </button>
                
                <p className="signup-link">
                    No account?
                    <a href="#">Sign up</a>
                </p>
            </form>
        </div>
    );
};

export default Login;