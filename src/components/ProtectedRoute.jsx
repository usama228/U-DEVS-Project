import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserDetails } from '../services/AuthService';
import { hasRouteAccess } from '../utils/rolePermissions';

const ProtectedRoute = ({ children, requiredRoute }) => {
    try {
        const userDetails = getUserDetails();
        
        if (!userDetails || (!userDetails.user && !userDetails.role)) {
            return <Navigate to="/login" replace />;
        }

        const userRole = userDetails.user?.role || userDetails.role;
        
        if (!userRole) {
            return <Navigate to="/login" replace />;
        }
        
        // Handle dynamic routes
        let routeToCheck = requiredRoute;
        if (routeToCheck.includes('/:id')) {
            routeToCheck = routeToCheck.substring(0, routeToCheck.lastIndexOf('/'));
        }

        const hasAccess = hasRouteAccess(userRole, routeToCheck);
        
        if (!hasAccess) {
            return (
                <div className="container-fluid">
                    <div className="row justify-content-center mt-5">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body text-center">
                                    <div className="mb-4">
                                        <i className="fas fa-lock fa-3x text-warning"></i>
                                    </div>
                                    <h4 className="card-title">Access Denied</h4>
                                    <p className="card-text">
                                        You don&apos;t have permission to access this page.
                                        Please contact your administrator if you believe this is an error.
                                    </p>
                                    <p className="text-muted">
                                        Your role: <span className="badge badge-secondary">{userRole}</span>
                                    </p>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => window.history.back()}
                                    >
                                        Go Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return children;
    } catch (error) {
        console.error('Error in ProtectedRoute:', error);
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
