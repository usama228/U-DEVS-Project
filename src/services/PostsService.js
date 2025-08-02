import axiosInstance from './AxiosInstance';
import { MockPostsService } from './MockBackendService';

// Check if we're in development mode and no backend is available
const USE_MOCK = import.meta.env.DEV && !import.meta.env.VITE_API_URL;

export function getPosts() {
    if (USE_MOCK) {
        return MockPostsService.getPosts();
    }
    return axiosInstance.get('/posts');
}

export function createPost(postData) {
    if (USE_MOCK) {
        return MockPostsService.createPost(postData);
    }
    return axiosInstance.post('/posts', postData);
}

export function updatePost(post, postId) {
    if (USE_MOCK) {
        return MockPostsService.updatePost(postId, post);
    }
    return axiosInstance.put(`/posts/${postId}`, post);
}

export function deletePost(postId) {
    if (USE_MOCK) {
        return MockPostsService.deletePost(postId);
    }
    return axiosInstance.delete(`/posts/${postId}`);
}

export function getPostById(postId) {
    if (USE_MOCK) {
        return MockPostsService.getPostById(postId);
    }
    return axiosInstance.get(`/posts/${postId}`);
}

export function formatPosts(postsData) {
    // For PostgreSQL, data comes as array, no need to format
    return postsData || [];
}
