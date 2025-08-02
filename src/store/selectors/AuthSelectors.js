export const isAuthenticated = (state) => {
    if (state.auth.auth.token) return true;
    return false;
};

export const getCurrentUser = (state) => {
    return state.auth.auth.user;
};

export const getAuthToken = (state) => {
    return state.auth.auth.token;
};
