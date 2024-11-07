import  Trip  from "../models/Trips.js"

export const tripData = async (req, res) => {
    const userId = req.userId 
    try {
        const trips = await Trip.find({userId: userId})
        if (!trips) {
            res.status(404).json({success: false, message: "No trips found"})
        }
        res.status(200).json({success: true, trips})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const deleteTrip = async (req, res) => {
    const userId = req.userId 
    const { tripId } = req.body
    try {
        const trip = await Trip.findOneAndDelete({_id: tripId, userId: userId})
        if (!trip) {
            return res.status(404).json({success: false, message: "Trip not found"})
        }
        res.status(200).json({success: true, message: "Trip deleted"})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const updateTrip = async (req, res) => {
    const userId = req.userId 
    const { tripId, itemId, updatedDescription } = req.body 
    try {
        const trip = await Trip.findOne({_id: tripId, userId: userId})
        if (!trip) {
            return res.status(404).json({success: false, message: "Trip not found "})
        }
        const itemToUpdate = trip.items.id(itemId)
        itemToUpdate.description = updatedDescription
        await trip.save()
        
        res.status(200).json({success: true, message: "Item updated successfully"})

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const createTrip = async (req, res) => {
    const { name, items } = req.body
    const userId = req.userId
    try {
        const newTrip = new Trip({
            userId: userId, 
            name: name, 
            items: items
        })
        await newTrip.save()
        res.status(201).json({success: true, message: "Trip successfully created", trip: newTrip})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}


