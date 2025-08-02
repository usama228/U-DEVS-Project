import axiosInstance from './AxiosInstance';

export function getLeaves() {
    return axiosInstance.get('/leaves');
}

export function getLeavesByUser(userId) {
    return axiosInstance.get(`/leaves/user/${userId}`);
}

export function createLeave(leaveData) {
    return axiosInstance.post('/leaves', leaveData);
}

export function updateLeaveStatus(leaveId, status) {
    return axiosInstance.patch(`/leaves/${leaveId}/status`, { status });
}

export function deleteLeave(leaveId) {
    return axiosInstance.delete(`/leaves/${leaveId}`);
} 