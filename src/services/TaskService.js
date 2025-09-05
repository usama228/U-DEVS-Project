import axiosInstance from './AxiosInstance';

// Task Management Service
export const TaskService = {
    // Get all tasks
    getAllTasks: () => {
        return axiosInstance.get('/tasks');
    },

    // Get task by ID
    getTaskById: (taskId) => {
        return axiosInstance.get(`/tasks/${taskId}`);
    },

    // Create new task (Admin only)
    createTask: (taskData) => {
        return axiosInstance.post('/tasks', taskData);
    },

    // Update task status
    updateTaskStatus: (taskId, status) => {
        return axiosInstance.patch(`/tasks/${taskId}/status`, { status });
    },

    // Submit task (Internee only)
    submitTask: (taskId, submissionData) => {
        const formData = new FormData();
        Object.keys(submissionData).forEach(key => {
            if (submissionData[key] !== null && submissionData[key] !== undefined) {
                formData.append(key, submissionData[key]);
            }
        });
        return axiosInstance.post(`/tasks/${taskId}/submit`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Accept task (Admin only)
    acceptTask: (taskId, feedback = '') => {
        return axiosInstance.post(`/tasks/${taskId}/accept`, { feedback });
    },

    // Reject task (Admin only)
    rejectTask: (taskId, feedback) => {
        return axiosInstance.post(`/tasks/${taskId}/reject`, { feedback });
    },

    // Delete task (Admin only)
    deleteTask: (taskId) => {
        return axiosInstance.delete(`/tasks/${taskId}`);
    }
};

export default TaskService;