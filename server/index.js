import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDB } from './DB/connectDB.js'
import { verifyToken } from './middleware/verifyToken.js'
import authRoutes from './routes/authRoutes.js'
import tripRoutes from './routes/tripRoutes.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)
app.use('/api/trips', verifyToken, tripRoutes)

app.listen(3002, ()=>{
    connectDB()
    console.log("Server is running on port", 3002)
})