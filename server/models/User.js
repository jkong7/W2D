import mongoose from 'mongoose'
import { verifyEmail } from '../controllers/authControllers.js'

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true, unique: true},
    name: {type: String, required: true}, 
    lastLogin: {type: Date, default: Date.now()}, 
    isVerified: {type: Boolean, default: false}, 
    resetPasswordToken: {type: String}, 
    resetPasswordTokenExpiresAt: {type: Date}, 
    verifyEmailToken: {type: String}, 
    verifyEmailTokenExpiresAt: {type: Date}
}, {timestamps: true})

const User = mongoose.model('User', userSchema)

export default User