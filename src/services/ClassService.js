import axiosInstance from './AxiosInstance';

export function getClasses() {
    return axiosInstance.get('/classes');
}

export function getClassesByDate(date) {
    return axiosInstance.get(`/classes/date/${date}`);
}

export function createClass(classData) {
    return axiosInstance.post('/classes', classData);
}

export function updateClass(classId, classData) {
    return axiosInstance.put(`/classes/${classId}`, classData);
}

export function deleteClass(classId) {
    return axiosInstance.delete(`/classes/${classId}`);
}