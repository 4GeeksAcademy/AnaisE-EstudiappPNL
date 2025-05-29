import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Email:', email);
    console.log('Password:', password);
  }
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }
  
  return (
  <div>
    <form classname="form">
      <p classname="form-title">Sign in to your account</p>
      <div classname="input-container">
        <input placeholder="Enter email" type="email" />
        <span>
          <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" strokewidth="{2}" strokelinejoin="round" strokelinecap="round" />
          </svg>
        </span>
      </div>
      <div classname="input-container">
        <input placeholder="Enter password" type="password" />
        <span>
          <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokewidth="{2}" strokelinejoin="round" strokelinecap="round" />
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokewidth="{2}" strokelinejoin="round" strokelinecap="round" />
          </svg>
        </span>
      </div>
      <button classname="submit" type="submit">
        Sign in
      </button>
      <p classname="signup-link">
        No account?
        <a href>Sign up</a>
      </p>
    </form>
    </div>
  );
  
 
 }
export default Login;