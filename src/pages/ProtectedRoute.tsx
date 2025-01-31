import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    isAuthenticated: boolean;
    children: JSX.Element;
}

function ProtectedRoute({ isAuthenticated, children }: ProtectedRouteProps) {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
