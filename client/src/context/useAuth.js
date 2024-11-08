import React, { useContext, useState, useEffect } from 'react'
import api from '../utility/api'

const AuthContext = React.createContext() 

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoadingAuth, setIsLoadingAuth] = useState(true)
    const [user, setUser] = useState(null)
    const checkAuth = async() => {
        try {
            const response = await api.get('auth/verify-token')
            setIsAuthenticated(true)
            setUser(response.data.user)
        } catch (error) {
            setIsAuthenticated(false)
        } finally {
            setIsLoadingAuth(false)
        }
    }

    const signup = async(name, email, password) => {
        try {
            const response = await api.post('auth/signup', { name, email, password })
            setIsAuthenticated(true)
        } catch(error) {
            setIsAuthenticated(false)
        }
    }

    const login = async(email, password) => {
        try {
            const response = await api.post('auth/login', { email, password })
            setIsAuthenticated(true)
        } catch (error) {
            setIsAuthenticated(false)
            throw new Error('Login failed')
        }
    }

    const logout = async() => {
        await api.post('auth/logout')
        setIsAuthenticated(false)
    }

    useEffect(()=>{
        checkAuth() 
    }, [])


    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoadingAuth, user, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

