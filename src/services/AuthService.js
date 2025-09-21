import axiosInstance from './AxiosInstance';
import Swal from "sweetalert2";
import {
    loginConfirmedAction,
    Logout,
} from '../store/actions/AuthActions';
import { MockAuthService } from './MockBackendService';

// Check if we're in development mode and no backend is available
const USE_MOCK = false; // Disable mock for now to test real backend

export function signUp(userData) {
    if (USE_MOCK) {
        return MockAuthService.signup(userData);
    }
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
        if (userData[key] !== null && userData[key] !== undefined) {
            formData.append(key, userData[key]);
        }
    });
    return axiosInstance.post('/auth/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export function login(email, password) {
    if (USE_MOCK) {
        return MockAuthService.login(email, password);
    }
    return axiosInstance.post('/auth/login', { email, password });
}

export function formatError(errorResponse) {
    let errorMessage = 'An error occurred';
    
    if (errorResponse?.response?.data?.message) {
        errorMessage = errorResponse.response.data.message;
    } else if (errorResponse?.message) {
        errorMessage = errorResponse.message;
    }
    
    Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: errorMessage,
        showCancelButton: true,
    });
    
    return errorMessage;
}

export function saveTokenInLocalStorage(tokenDetails) {
    tokenDetails.expireDate = new Date(
        new Date().getTime() + tokenDetails.expiresIn * 1000,
    );
    localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
}

export function runLogoutTimer(dispatch, timer, navigate) {
    setTimeout(() => {        
        dispatch(Logout(navigate));
    }, timer);
}

export function checkAutoLogin(dispatch, navigate) {
    const tokenDetailsString = localStorage.getItem('userDetails');
    
    if (!tokenDetailsString) {
        console.log('No token found, user not authenticated');
        return;
    }

    try {
        const tokenDetails = JSON.parse(tokenDetailsString);
        
        if (!tokenDetails.expireDate) {
            console.log('No expiration date found, clearing invalid token');
            localStorage.removeItem('userDetails');
            return;
        }
        
        const expireDate = new Date(tokenDetails.expireDate);
        const todaysDate = new Date();

        if (todaysDate > expireDate) {
            console.log('Token expired, clearing expired token');
            localStorage.removeItem('userDetails');
            return;
        }
        
        console.log('Valid token found, logging in user');
        dispatch(loginConfirmedAction(tokenDetails));
        
        const timer = expireDate.getTime() - todaysDate.getTime();
        runLogoutTimer(dispatch, timer, navigate);
    } catch (error) {
        console.error('Error parsing stored token:', error);
        localStorage.removeItem('userDetails');
    }
}

export function updateProfile(userData) {
    const formData = new FormData();
    const processedUserData = { ...userData };

    // Handle phone number format: remove leading zero
    if (processedUserData.phone && typeof processedUserData.phone === 'string' && processedUserData.phone.startsWith('0')) {
        processedUserData.phone = processedUserData.phone.substring(1);
    }

    // Append only non-null, non-undefined, and non-empty string values
    Object.keys(processedUserData).forEach(key => {
        const value = processedUserData[key];

        // This condition ensures that no empty fields are sent to the backend
        if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value);
        }
    });

    return axiosInstance.put('/auth/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export function changePassword(currentPassword, newPassword) {
    return axiosInstance.put('/auth/change-password', {
        currentPassword,
        newPassword
    });
}

export function adminChangePassword(userId, newPassword) { // Added this function
    return axiosInstance.put('/auth/admin/change-password', {
        userId,
        newPassword
    });
}

export function getProfile() {
    return axiosInstance.get('/auth/profile');
}

export function getUserDetails() {
    const tokenDetailsString = localStorage.getItem('userDetails');
    if (tokenDetailsString) {
        try {
            const tokenDetails = JSON.parse(tokenDetailsString);
            return tokenDetails.user; // Return the user object
        } catch (error) {
            return null;
        }
    }
    return null;
}

export function isLogin() {
    const tokenDetailsString = localStorage.getItem('userDetails');

    if (tokenDetailsString) {
        try {
            JSON.parse(tokenDetailsString);
            return true;
        } catch (error) {
            return false;
        }
    } else {
        return false;
    }
}
