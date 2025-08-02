import axiosInstance from './AxiosInstance';
import Swal from "sweetalert2";
import {
    loginConfirmedAction,
    Logout,
} from '../store/actions/AuthActions';
import { MockAuthService } from './MockBackendService';

// Check if we're in development mode and no backend is available
const USE_MOCK = import.meta.env.DEV && !import.meta.env.VITE_API_URL;

export function signUp(userData) {
    if (USE_MOCK) {
        return MockAuthService.signup(userData);
    }
    return axiosInstance.post('/auth/signup', userData);
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
    let tokenDetails = '';
    if (!tokenDetailsString) {
        dispatch(Logout(navigate));
        return;
    }

    try {
        tokenDetails = JSON.parse(tokenDetailsString);
        let expireDate = new Date(tokenDetails.expireDate);
        let todaysDate = new Date();

        if (todaysDate > expireDate) {
            dispatch(Logout(navigate));
            return;
        }
            
        dispatch(loginConfirmedAction(tokenDetails));
        
        const timer = expireDate.getTime() - todaysDate.getTime();
        runLogoutTimer(dispatch, timer, navigate);
    } catch (error) {
        console.error('Error parsing stored token:', error);
        dispatch(Logout(navigate));
    }
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
