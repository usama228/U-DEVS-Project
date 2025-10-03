import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserDetails } from '../services/AuthService';
import { hasRouteAccess } from '../utils/rolePermissions';

const ProtectedRoute = ({ children, requiredRoute }) => {
    try {
        const userDetails = getUserDetails();
        
        console.log('ProtectedRoute Debug:');
        console.log('- userDetails:', userDetails);
        console.log('- requiredRoute:', requiredRoute);
        
        if (!userDetails || (!userDetails.user && !userDetails.role)) {
            console.log('- Redirecting to login: no user details');
            return <Navigate to="/login" replace />;
        }

        // Handle both possible structures: userDetails.user.role or userDetails.role
        const userRole = userDetails.user?.role || userDetails.role;
        console.log('- userRole:', userRole);
        
        if (!userRole) {
            console.log('- Redirecting to login: no role found');
            return <Navigate to="/login" replace />;
        }
        
        const hasAccess = hasRouteAccess(userRole, requiredRoute);
        console.log('- hasAccess:', hasAccess);
        
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
