import axiosInstance from './AxiosInstance';

export function getAttendanceByUser(userId, startDate, endDate) {
    return axiosInstance.get(`/attendance/user/${userId}`, {
        params: { startDate, endDate }
    });
}

export function checkIn(userId) {
    return axiosInstance.post('/attendance/checkin', { userId });
}

export function checkOut(userId) {
    return axiosInstance.post('/attendance/checkout', { userId });
}

export function updateBreakTime(userId, breakTime) {
    return axiosInstance.patch('/attendance/break', { userId, breakTime });
}

export function getAttendanceByDate(date) {
    return axiosInstance.get(`/attendance/date/${date}`);
} 