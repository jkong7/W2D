import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import api from '../../utility/api';
import '../../css/Auth.css';

const VerifyEmail = () => {
    const [token, setToken] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/verify-email', { verifyToken: token });
            setMessage("Email successfully verified! Redirecting...")
            setTimeout(()=> {
                navigate('/dashboard')
            }, 2000)
        } catch (error) {
            setMessage("Verification failed. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Verify Your Email</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Verification Code</span>
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Enter the 6-character code"
                    />
                </label>
                <button type="submit">Verify</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default VerifyEmail;
