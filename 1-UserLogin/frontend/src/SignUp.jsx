import React, { useState } from 'react';
import axios from 'axios';
import './App.css'
import { FaUser, FaLock } from "react-icons/fa"
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault(); //?
        try {
            const response = await axios.post('http://localhost:5001/signup', { username, password }); //?
            console.log('User signed up successfully:', response.data);
            navigate('/success');
        } catch (error) {
            console.error('There was an error signing up:', error);
        }
    }

  return (
    <div className='wrapper'>
    <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <div className="input-box">
            <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required/>
            {/* ^^? */}
            <FaUser className="icon"/>
        </div>
        <div className="input-box">
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
            {/* ^^? */}
            <FaLock className="icon"/>
        </div>
        <button type="submit">Sign Up</button> 
        {/* ^ after this button is pressed, handleSubmit will run  */}
        <div className="register-link">
            <p>Dont have an account? <a href="/">Login</a></p>
        </div>
    </form>
</div>
  );
}

export default SignUp;

