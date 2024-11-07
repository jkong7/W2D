import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie = (res, userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax', // Lax for development
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
        return token;
    } catch (error) {
        throw new Error("Error generating token or setting cookie");
    }
};
