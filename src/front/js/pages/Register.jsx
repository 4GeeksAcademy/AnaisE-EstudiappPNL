import React, {useState} from 'react'
import "../../styles/home.css";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "username") {
            setUsername(value);
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        const backendUrl = process.env.BACKEND_URL
        if (!backendUrl) {
            console.error("BACKEND_URL is not defined in the environment variables.");
            return;
        }
        try {
            const response = await fetch(`${backendUrl}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log("Registration successful:", data);
            navigate("/login");
        } catch (error) {
            console.error("Error occurred during registration:", error);
        }
        console.log("Form submitted with:", { username, email, password });
        
    }
    return (
        <div>


            <div className="container">
                <div className="heading">SignIn to your account</div>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="input-field">
                        <input required autoComplete="off" type="text" name="username" value={username} onChange={handleChange} />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="input-field">
                        <input required autoComplete="off" type="email" name= "email" value={email} onChange={handleChange}/>
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="input-field">
                        <input required autoComplete="off" type="password" name="password" value={password} onChange={handleChange}/>
                        <label htmlFor="username">Password</label>
                    </div>
                    <div className="btn-container">
                        <button className="btn" type="submit">Submit</button>
                        <div className="acc-text">
                                    <span style={{ color: '#0000ff', cursor: 'pointer' }}>Create Account</span>
                        </div>
                    </div>
                </form>
            </div>



        </div>
    )
}

export default Register
