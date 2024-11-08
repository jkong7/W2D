import React from 'react'


export default function play() {
  return (
    <div className="dashboard-card">
        <div className="dashboard-header">
            <h2 className="section-title">RECS:</h2>
            <button className="sign-out-button">Sign out</button>
        </div>

        <div className="recommendations-list">
            {mockRecommendations.map(rec=>(
                <div className="recommendation-item" key={rec.id}>{rec.title}</div>
            ))}
        </div>
        
        <h2 className="section-title">{user?.name ? `${user.name}'s Trips` : 'My Trips'}</h2>

        <div className="trips-list-scrollable">
            {trips.map(trip=>(
                <div key={trip._id} className="trip-item">
                    <button className="delete-button"></button>&times;
                </div>
                

            ))}
        </div>
    </div>
  )
}
