import axiosInstance from './AxiosInstance';

// User Management Service
export const UserService = {
    // Get all users (Admin only)
    getAllUsers: () => {
        return axiosInstance.get('/users');
    },

    // Get dashboard statistics
    getDashboardStats: () => {
        return axiosInstance.get('/users/dashboard-stats');
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
        return axiosInstance.post('/auth/register', userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};

export default UserService;