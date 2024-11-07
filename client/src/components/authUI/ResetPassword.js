import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utility/api';
import '../../css/Auth.css';

const ResetPassword = () => {
    const { token } = useParams(); 
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setMessage("Password reset successful! Redirecting to login...");
            setTimeout(() => {
                navigate('/login'); 
            }, 2000);
        } catch (error) {
            setMessage("Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>New Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your new password"
                    />
                </label>
                <button type="submit">Reset Password</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default ResetPassword;
