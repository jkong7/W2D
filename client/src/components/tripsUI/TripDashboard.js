import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/useTrips'; 
import { useAuth } from '../../context/useAuth';
import '../../css/TripDashboard.css';

const mockRecommendations = [
    { id: 'rec1', title: 'Explore Tokyo' },
    { id: 'rec2', title: 'Beach Getaway' },
];

const TripDashboard = () => {
    const navigate = useNavigate();
    const { trips, isLoadingTrips, deleteTrip } = useTrips(); 
    const { user, logout } = useAuth(); 

    const handleNewTripClick = () => {
        navigate('/new-trip');
    };

    const handleSignOut = async () => {
        await logout(); 
        navigate('/'); 
    };

    const handleDelete = async (tripId) => {
        if (window.confirm("Are you sure you want to delete this trip?")) {
            try {
                await deleteTrip(tripId); 
            } catch (error) {
                throw new Error('Error deleting trip')
            }
        }
    };
    

    if (isLoadingTrips) {
        return (
            <div className="dashboard-container">
                <h2>Loading your trips...</h2>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <div className="dashboard-header">
                    <h2 className="section-title">RECS:</h2>
                    <button className="sign-out-button" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>
                <div className="recommendations-list">
                    {mockRecommendations.map((rec) => (
                        <div key={rec.id} className="recommendation-item">
                            {rec.title}
                        </div>
                    ))}
                </div>

                <h2 className="section-title">{user?.name ? `${user.name}'s Trips` : 'My Trips'}:</h2>
                <div className="trips-list scrollable">
                    {trips.map((trip) => (
                        <div key={trip._id} className="trip-item">
                            <button
                                className="delete-trip-button"
                                onClick={() => handleDelete(trip._id)}
                            >
                                &times;
                            </button>
                            <Link to={`/itinerary/${trip._id}`} className="trip-link">
                                {trip.name}
                            </Link>
                        </div>
                    ))}
                </div>


                <button className="new-trip-button" onClick={handleNewTripClick}>
                    New Trip
                </button>
            </div>
        </div>
    );
};

export default TripDashboard;
