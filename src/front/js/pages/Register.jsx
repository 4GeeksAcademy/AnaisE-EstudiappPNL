import React, {useState} from 'react'
import "../../styles/home.css";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div>


            <div className="container">
                <div className="heading">SignIn to your account</div>
                <form className="form" action>
                    <div className="input-field">
                        <input required autoComplete="off" type="text" name="text" id="username" />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="input-field">
                        <input required autoComplete="off" type="email" name="email" id="email" />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="input-field">
                        <input required autoComplete="off" type="password" name="text" id="password" />
                        <label htmlFor="username">Password</label>
                    </div>
                    <div className="btn-container">
                        <button className="btn">Submit</button>
                        <div className="acc-text">
                            New here ?
                            <span style={{ color: '#0000ff', cursor: 'pointer' }}>Create Account</span>
                        </div>
                    </div>
                </form>
            </div>



        </div>
    )
}

export default Register
