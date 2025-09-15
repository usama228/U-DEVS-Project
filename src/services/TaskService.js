import axiosInstance from './AxiosInstance';

// A function to get the user from local storage
const getAuthToken = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    return userDetails ? userDetails.token : null;
};

// A helper function to create the Authorization header
const getAuthHeader = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};


// Corrected TaskService implementation
export const TaskService = {
    // Fetches all tasks
    getAllTasks: () => {
        return axiosInstance.get('/tasks', { headers: getAuthHeader() });
    },

    // Fetches tasks assigned to the current user
    getMyTasks: () => {
        return axiosInstance.get('/tasks/my-tasks', { headers: getAuthHeader() });
    },

    // Fetches a single task by its ID
    getTaskById: (id) => {
        return axiosInstance.get(`/tasks/${id}`, { headers: getAuthHeader() });
    },

    // Creates a new task
    createTask: (taskData) => {
        return axiosInstance.post('/tasks', taskData, { headers: getAuthHeader() });
    },

    // Submits a task (for internees)
    submitTask: (id, submissionData) => {
        return axiosInstance.post(`/tasks/${id}/submit`, submissionData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Accepts a task (for admins/team leads)
    acceptTask: (id, data) => {
        return axiosInstance.post(`/tasks/${id}/accept`, data, { headers: getAuthHeader() });
    },

    // Rejects a task (for admins/team leads)
    rejectTask: (id, data) => {
        return axiosInstance.post(`/tasks/${id}/reject`, data, { headers: getAuthHeader() });
    },

    // Deletes a task
    deleteTask: (id) => {
        return axiosInstance.delete(`/tasks/${id}`, { headers: getAuthHeader() });
    },
};