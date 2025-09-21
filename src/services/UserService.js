import axiosInstance from './AxiosInstance';

// User Management Service
export const UserService = {
    // Get all users (Admin only)
    getAllUsers: (params) => {
        return axiosInstance.get('/users', { params });
    },

    // Get a single user by ID
    getUserById: (userId) => {
        return axiosInstance.get(`/users/${userId}`);
    },

    // Update a user's profile
    updateUser: (userId, userData) => {
        return axiosInstance.put(`/users/${userId}`, userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Delete a user (Admin only)
    deleteUser: (userId) => {
        return axiosInstance.delete(`/users/${userId}`);
    },

    // Get dashboard statistics
    getDashboard: () => {
        return axiosInstance.get('/users/dashboard');
    },

    // Get team leads
    getTeamLeads: () => {
        return axiosInstance.get('/users/team-leads');
    },

    // Get internees
    getInternees: (teamLeadId = null) => {
        const url = teamLeadId ? `/users/internees/${teamLeadId}` : '/users/internees';
        return axiosInstance.get(url);
    },

    // Update user status (Admin only)
    updateUserStatus: (userId, isActive) => {
        return axiosInstance.put(`/users/${userId}/status`, { isActive });
    },

    // Update user role (Admin only)
    updateUserRole: (userId, role, teamLeadId = null) => {
        const data = { role };
        if (teamLeadId) data.teamLeadId = teamLeadId;
        return axiosInstance.put(`/users/${userId}/role`, data);
    },

    // Create new user (Admin only)
    createUser: (userData) => {
        console.log('Creating user with data:', userData);
        return axiosInstance.post('/auth/register', userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};

export default UserService;
