import express from 'express'
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword, checkAuth } from '../controllers/authControllers.js'
import { verifyToken } from '../middleware/verifyToken.js'

const authRoutes = express.Router()

authRoutes.post('/signup', signup)
authRoutes.post('/login', login)
authRoutes.post('/logout', logout)

authRoutes.post('/verify-email', verifyEmail)
authRoutes.post('/forgot-password', forgotPassword)
authRoutes.post('/reset-password/:token', resetPassword)

authRoutes.get('/verify-token', verifyToken, checkAuth)


export default authRoutes

