// NewTrip.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/NewTrips.css';

const NewTrip = () => {
    const [link, setLink] = useState('');
    const [days, setDays] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('New Trip:', { link, days });
        navigate('/dashboard');
    };

    return (
        <div className="new-trip-container">
            <h2>Create a New Trip</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Link</span>
                    <input
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="Enter the link"
                    />
                </label>
                <label>
                    <span>Days</span>
                    <input
                        type="number"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        placeholder="Enter the number of days"
                    />
                </label>
                <button type="submit">Create Trip</button>
            </form>
        </div>
    );
};

export default NewTrip;
