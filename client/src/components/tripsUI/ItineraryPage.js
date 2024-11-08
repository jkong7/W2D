import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/useTrips';
import '../../css/ItineraryPage.css';

const ItineraryPage = () => {
    const { tripId } = useParams();
    const { trips, isLoadingTrips, updateTrip } = useTrips(); 
    const navigate = useNavigate()

    const trip = trips.find((trip) => trip._id === tripId);

    const [selectedItem, setSelectedItem] = useState(null);
    const [editedDescription, setEditedDescription] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (item) => {
        setSelectedItem(item);
        setEditedDescription(item.description);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (selectedItem) {
            try {
                updateTrip(tripId, selectedItem._id, editedDescription)
            } catch (error) {
                throw new Error('Error updating trip description')
            }            
            setIsModalOpen(false);
        }
    };

    const handleBack = () => {
        navigate('/dashboard')
    }

    if (isLoadingTrips) {
        return (
            <div className="itinerary-container">
                <h2>Loading itinerary...</h2>
            </div>
        );
    }

    if (!trip) {
        return <div className="itinerary-container">Trip not found</div>;
    }

    return (
        <div className="itinerary-container">
            <h2>Itinerary for {trip.name}</h2>
            {trip.items.map((item, index) => (
                <div key={item._id} className="day-section">
                    <h3>Day {item.day}</h3>
                    <div className="location-card">
                        <div className="location-name">{item.location}</div>
                        <button className="edit-button" onClick={() => openModal(item)}>
                            Edit
                        </button>
                    </div>
                </div>
            ))}

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setIsModalOpen(false)}>
                            &times;
                        </button>
                        <h3>Edit Description for {selectedItem?.location}</h3>
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                        <button className="save-button" onClick={handleSave}>
                            Save
                        </button>
                    </div>
                </div>
            )}
            <button onClick={handleBack} className="dashboard-button">Dashboard</button>
        </div>
    );
};

export default ItineraryPage;
