import axiosInstance from './AxiosInstance';

export function getProjects() {
    return axiosInstance.get('/projects');
}

export function getProjectsByUser(userId) {
    return axiosInstance.get(`/projects/user/${userId}`);
}

export function createProject(projectData) {
    return axiosInstance.post('/projects', projectData);
}

export function updateProject(projectId, projectData) {
    return axiosInstance.put(`/projects/${projectId}`, projectData);
}

export function updateProjectStatus(projectId, status) {
    return axiosInstance.patch(`/projects/${projectId}/status`, { status });
}

export function deleteProject(projectId) {
    return axiosInstance.delete(`/projects/${projectId}`);
}