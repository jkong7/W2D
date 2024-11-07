import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import '../../css/Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const { login } = useAuth()
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password)
            navigate('/dashboard')
        } catch (error) {
            setMessage("Login failed. Please try again")
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </label>
                <label>
                    <span>Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </label>
                <button type="submit">Log In</button>
            </form>
            {message && <p className="message">{message}</p>}
            <div className="auth-links">
                <Link to="/forgot-password">Forgot Password?</Link>
                <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    );
};

export default Login;
