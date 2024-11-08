import express from 'express'
import { tripData, deleteTrip, updateTrip, createTrip, generateTrip } from '../controllers/tripControllers.js';


const tripRoutes = express.Router()

tripRoutes.get('/trip-data', tripData)
tripRoutes.delete('/delete-trip', deleteTrip)
tripRoutes.post('/update-trip', updateTrip)
tripRoutes.post('/create-trip', createTrip)
tripRoutes.post('/generate-trip', generateTrip)

export default tripRoutes