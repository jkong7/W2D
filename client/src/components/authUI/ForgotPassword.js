import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utility/api';
import '../../css/Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/forgot-password', { email });
            setMessage("Password reset link has been sent to your email.");
        } catch (error) {
            setMessage("Failed to send password reset link. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Forgot Password</h2>
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
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p className="message">{message}</p>}
            <div className="auth-links">
                <Link to="/login">Back to Login</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
