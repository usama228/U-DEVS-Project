import axiosInstance from './AxiosInstance';

export function getUsers() {
    return axiosInstance.get('/users');
}

export function getUserById(userId) {
    return axiosInstance.get(`/users/${userId}`);
}

export function createUser(userData) {
    return axiosInstance.post('/users', userData);
}

export function updateUser(userId, userData) {
    return axiosInstance.put(`/users/${userId}`, userData);
}

export function deleteUser(userId) {
    return axiosInstance.delete(`/users/${userId}`);
}

export function approveUser(userId) {
    return axiosInstance.patch(`/users/${userId}/approve`);
} 