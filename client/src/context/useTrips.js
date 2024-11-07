import React, { useContext, useState, useEffect } from 'react'
import api from '../utility/api'
import { useAuth } from './useAuth'

const TripsContext = React.createContext()

export function useTrips () {
    return useContext(TripsContext)
}

export function TripsProvider ({ children }) {
    const { isAuthenticated, isLoadingAuth } = useAuth()
    const [isLoadingTrips, setIsLoadingTrips] = useState(true)
    const [trips, setTrips] = useState([])
    const fetchTrips = async () => {
        if (isAuthenticated) {
            try {
                const response = await api.get('/trips/trip-data')
                setTrips(response.data.trips)
            } catch (error) {
                console.log(error.message)
            } finally {
                setIsLoadingTrips(false)
            }
        } else {
            setIsLoadingTrips(false)
        }
    }

    const deleteTrip = async(tripId) => {
        if (isAuthenticated) {
            try {
                const response = await api.delete('/trips/delete-trip', {
                    data: { tripId }
                })
                setTrips(prevTrips => {
                    return prevTrips.filter(trip=>trip._id!==tripId)
                })
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    const updateTrip = async(tripId, itemId, updatedDescription) => {
        if(isAuthenticated) {
            try {
                const response = await api.post('/trips/update-trip', { tripId, itemId, updatedDescription })
                setTrips(prevTrips => 
                    prevTrips.map(trip => 
                        trip._id === tripId 
                            ? {
                                ...trip, 
                                items: trip.items.map(item =>
                                    item._id === itemId 
                                    ? {...item, description: updatedDescription}
                                    : item 
                                )
                            } : trip
                    )
                )
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    const createTrip = async(tripName, items) => {
        try {
            const response = await api.post('/trips/create-trip', { tripName, items })
            setTrips(prevTrips =>
                [...prevTrips, response.data.trip]
            )
        } catch (error) {
            console.log(error.message)
        }
    }
    

    useEffect(() => {
        if (!isLoadingAuth) {
            fetchTrips()
        }
    }, [isAuthenticated, isLoadingAuth])

    return (
        <TripsContext.Provider value={{ trips, isLoadingTrips, deleteTrip, updateTrip, createTrip }}>
            {children}
        </TripsContext.Provider>
    )
}