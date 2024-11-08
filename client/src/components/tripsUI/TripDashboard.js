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
        try {
            await deleteTrip(tripId); 
        } catch (error) {
            throw new Error('Error deleting trip')
        }
    };
    
    if (isLoadingTrips) {
        return (
            <div className="dashboard-container">
                <h2>Loading your trips...</h2>
            </div>
        );
    }

    //"dashboard-container", dashboard-card", "dashboard-header", 
    //section-title, sign-out-button, recommendations-list, recommendation item
    //section title, trips-list-scrollable, trip-item, delete-trip-button
    //link to trip-link, new-trip button 

    return (
        <div className="dashboard-card">

                <h2 className="section-title">RECS:</h2>
                <button onClick={handleSignOut} className="sign-out-button">Sign out</button>

            <div className="recommendations-list">
                {mockRecommendations.map(rec=>(
                    <div key={rec.id} className="recommendation-item">{rec.title}</div>
                ))}
            </div>

            <div className="section-title">{user?.name ? `${user.name}'s Trips` : 'My Trips'}</div>
            
            <div className="trips-list scrollable">
                {trips.map(trip=>(
                    <div key={trip._id} className="trip-item">
                        <button onClick={()=>handleDelete(trip._id)} className="delete-trip-button">&times;</button> 
                        <Link className="trip-link" to={`/itinerary/${trip._id}`}>{trip.name}</Link>
                    </div>
                ))}
            </div>

            <button onClick={handleNewTripClick} className="new-trip-button"> New Trip </button>

        </div>
    )
};

export default TripDashboard;

