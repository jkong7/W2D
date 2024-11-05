import  User from "../models/User.js"
import { generateTokenAndSetCookie } from "../utility/generateTokenAndSetCookie.js"
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail } from "../emails/emails.js"
import bcrypt from 'bcryptjs'
import crypto from 'crypto'


export const signup = async (req,res) => {
    const { name, email, password } = req.body
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const userAlreadyExists = await User.findOne({email})
        if (userAlreadyExists) {
            res.status(400).json({success: false, message: "User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const verifyEmailToken = Math.floor(10000 + Math.random()*900000).toString()
        const verifyEmailTokenExpiresAt = Date.now() + 24*60*60*1000
        const user = new User({name: name, email: email, password: hashedPassword, verifyEmailToken: verifyEmailToken, verifyEmailTokenExpiresAt: verifyEmailTokenExpiresAt})
        await user.save() 
        
        generateTokenAndSetCookie(res, user._id)

        await sendVerificationEmail(user.email, verifyEmailToken)

        res.status(201).json({success: true, message: "Sign up successful", user: {
            ...user._doc, 
            password: undefined 
        }})

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const login = async (req,res) => {
    const { email, password } = req.body 
    try {
        const findEmail = await User.findOne({email})
        if (!findEmail) {
            return res.status(404).json({success: false, message: "Email not found"})
        }
        const isPasswordValid = await bcrypt.compare(password, findEmail.password)
        if (!isPasswordValid) {
            return res.status(401).json({success: false, message: "Invalid password"})
        }
        generateTokenAndSetCookie(res, findEmail._id)
        findEmail.lastLogin=new Date()
        await findEmail.save()

        res.status(200).json({success: true, message: "Login successful", user: {
            ...findEmail._doc, 
            password: undefined
        }})

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const logout = async (req,res) => {
    res.clearCookie('token')
    res.status(200).json({success: true, message: "Logout successful"})
}

export const verifyEmail = async (req, res) => {
    const { verifyToken } = req.body
    try {
        const user = await User.findOne({
            verifyEmailToken: verifyToken, 
            verifyEmailTokenExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({success: false, message: "Invalid or expired verification code"})
        }
        user.verifyEmailToken=undefined 
        user.verifyEmailTokenExpiresAt=undefined 
        user.isVerified=true
        await user.save()
        
        await sendWelcomeEmail(user.email)

        res.status(200).json({success: true, message: "Verification email sent"})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body 
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({success: false, message: "User not found"})
        }
        const resetPasswordToken = crypto.randomBytes(20).toString('hex')
        const resetPasswordExpiresAt = Date.now()+1*60*60*1000
        user.resetPasswordToken = resetPasswordToken
        user.resetPasswordTokenExpiresAt = resetPasswordExpiresAt
        await user.save() 

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`)

        res.status(200).json({success: true, message: "Password reset email sent"})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const resetPassword = async (req, res) => {
 const { password } = req.body 
 const resetPasswordToken = req.params.token 
 try {
    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken, 
        resetPasswordTokenExpiresAt: { $gt: Date.now() }
    })
    if (!user) {
        return res.status(400).json({success: false, message: "Invalid or expired password reset token"})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword
    user.resetPasswordToken = undefined 
    user.resetPasswordTokenExpiresAt = undefined 
    await user.save() 
    
    await sendPasswordResetSuccessEmail(user.email)

    res.status(200).json({success: true, message: "Password reset success email sent"})
 } catch (error) {
    res.status(500).json({success: false, message: error.message})
 }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        if (!user) {
            return res.status(400).json({success: false, message: "User not found"})
        }
        return res.status(200).json({success: true, user})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}