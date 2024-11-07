import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/authUI/Login';
import SignUp from './components/authUI/SignUp';
import ForgotPassword from './components/authUI/ForgotPassword';
import TripDashboard from './components/tripsUI/TripDashboard';
import ItineraryPage from './components/tripsUI/ItineraryPage';
import NewTrip from './components/tripsUI/NewTrip';
import VerifyEmail from './components/authUI/VerifyEmail';
import ResetPassword from './components/authUI/ResetPassword';
import { AuthProvider, useAuth } from './context/useAuth';
import { TripsProvider } from './context/useTrips';

const App = () => {
    return (
      <BrowserRouter>
      <AuthProvider>
          <TripsProvider>
                <Routes>

                  <Route path="/" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  

                  <Route
                      path="/dashboard"
                      element={
                      <ProtectedRoute>
                        <TripDashboard/>
                      </ProtectedRoute>
                      }
                  />

                  <Route
                      path="/new-trip"
                      element={
                        <ProtectedRoute>
                          <NewTrip/>
                        </ProtectedRoute>
                        }
                  />

                  <Route
                      path="/itinerary/:tripId"
                      element={
                        <ProtectedRoute>
                          <ItineraryPage/>
                        </ProtectedRoute>
                        }
                  />


                  <Route path="*" element={<Navigate to="/" />} />

              </Routes>
          </TripsProvider>
        </AuthProvider>
      </BrowserRouter>
    );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoadingAuth } = useAuth()

  if (isLoadingAuth) return <div>Loading...</div>

  return isAuthenticated ? children : <Navigate to="/"/>
}

export default App;
