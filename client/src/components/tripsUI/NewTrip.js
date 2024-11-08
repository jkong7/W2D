import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/NewTrips.css';
import api from '../../utility/api';
import { useTrips } from '../../context/useTrips';

const NewTrip = () => {
    const [link, setLink] = useState('');
    const [days, setDays] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { createTrip } = useTrips()
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const generateResponse = await api.post('/trips/generate-trip', {
                url: link,
                numberOfDays: days,
            });
            const { tripName, itinerary } = generateResponse.data.trip;
            
            const response = await createTrip(tripName, itinerary);

            const tripId = response.data.trip._id
            navigate(`/itinerary/${tripId}`);

        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Generating...' : 'Create Trip'}
                </button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default NewTrip;
