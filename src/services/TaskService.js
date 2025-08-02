import axiosInstance from './AxiosInstance';

export function getTasks() {
    return axiosInstance.get('/tasks');
}

export function getTasksByUser(userId) {
    return axiosInstance.get(`/tasks/user/${userId}`);
}

export function createTask(taskData) {
    return axiosInstance.post('/tasks', taskData);
}

export function updateTask(taskId, taskData) {
    return axiosInstance.put(`/tasks/${taskId}`, taskData);
}

export function updateTaskStatus(taskId, status) {
    return axiosInstance.patch(`/tasks/${taskId}/status`, { status });
}

export function deleteTask(taskId) {
    return axiosInstance.delete(`/tasks/${taskId}`);
}