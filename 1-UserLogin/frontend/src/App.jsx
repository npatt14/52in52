import React, { useState } from 'react';
import axios from 'axios';
import './App.css'
import { FaUser, FaLock } from "react-icons/fa"
import { Link, useNavigate } from 'react-router-dom'; // link replaces <a> anchor, allowing us to navigate between different routes in our SPA without triggering a full page reload

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault(); // prevents default form submission behavior, which would cause a page reload.
        try {
            const response = await axios.post('http://localhost:5001/login', { username, password });
            // ^ sends a post request to servers /signup endpoint with the provided username and password form lines 7 & 8
            console.log('User logged in successfully:', response.data);
            navigate('/success');
        } catch (error) {
            console.error('There was an error logging in :', error);
        }
    };

  return (
    <div className='wrapper'>
    <form onSubmit={handleSubmit}>
        <h1>Log In</h1>
        <div className="input-box">
            <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required/>
            {/* ^^^ Link the input value to the component state and update the state when the input changes */}
            <FaUser className="icon"/>
        </div>
        <div className="input-box">
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <FaLock className="icon"/>
        </div>

        <button type="submit">Login</button>
        {/* ^ when button is pressed, handleSubmit will be invoked  */}

        <div className="register-link">
            <p>Dont have an account? <Link to="/signup">Sign Up</Link></p>
            {/* Clicking on "Sign Up" will now navigate to the /signup route defined in your React Router setup. */}
        </div>
    </form>
</div>
  )
}

export default App

