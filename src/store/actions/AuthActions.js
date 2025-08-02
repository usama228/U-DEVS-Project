import {
    formatError,
    login,
    runLogoutTimer,
    saveTokenInLocalStorage,
    signUp,
} from '../../services/AuthService';

import {
    SIGNUP_CONFIRMED_ACTION,
    SIGNUP_FAILED_ACTION,
    LOGIN_CONFIRMED_ACTION,
    LOGIN_FAILED_ACTION,
    LOADING_TOGGLE_ACTION,
    LOGOUT_ACTION,
    NAVTOGGLE,
} from './AuthActionTypes';

export function signupAction(userData, navigate) {
    return (dispatch) => {
        signUp(userData)
        .then((response) => {
            const { token, user } = response.data;
            const tokenDetails = {
                token,
                user,
                expiresIn: 3600, // 1 hour
            };
            saveTokenInLocalStorage(tokenDetails);
            runLogoutTimer(
                dispatch,
                tokenDetails.expiresIn * 1000,                
            );
            dispatch(confirmedSignupAction(tokenDetails));
            navigate('/dashboard');
        })
        .catch((error) => {
            const errorMessage = formatError(error);
            dispatch(signupFailedAction(errorMessage));
        });
    };
}

export function Logout(navigate) {
    localStorage.removeItem('userDetails');
    navigate('/login');    
    return {
        type: LOGOUT_ACTION,
    };
}

export function loginAction(email, password, navigate) {
    return (dispatch) => {
         login(email, password)
            .then((response) => { 
                const { token, user } = response.data;
                const tokenDetails = {
                    token,
                    user,
                    expiresIn: 3600, // 1 hour
                };
                saveTokenInLocalStorage(tokenDetails);
                runLogoutTimer(
                    dispatch,
                    tokenDetails.expiresIn * 1000,
                    navigate,
                );
               dispatch(loginConfirmedAction(tokenDetails));                          
                navigate('/dashboard');                
            })
            .catch((error) => {                
                const errorMessage = formatError(error);
                dispatch(loginFailedAction(errorMessage));
            });
    };
}

export function loginFailedAction(data) {
    return {
        type: LOGIN_FAILED_ACTION,
        payload: data,
    };
}

export function loginConfirmedAction(data) {
    return {
        type: LOGIN_CONFIRMED_ACTION,
        payload: data,
    };
}

export function confirmedSignupAction(payload) {
    return {
        type: SIGNUP_CONFIRMED_ACTION,
        payload,
    };
}

export function signupFailedAction(message) {
    return {
        type: SIGNUP_FAILED_ACTION,
        payload: message,
    };
}

export function loadingToggleAction(status) {
    return {
        type: LOADING_TOGGLE_ACTION,
        payload: status,
    };
}

export const navtoggle = () => {
    return {        
        type: NAVTOGGLE,
    };
};