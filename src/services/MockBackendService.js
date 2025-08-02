// Temporary mock service for development until backend is ready
import { delay } from '../utils/helpers';

const mockUsers = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@akademi.com',
        cnic: '12345-1234567-1',
        role: 'admin',
        work_mode: 'full_time',
        approved: true,
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        name: 'John Doe',
        email: 'john@akademi.com',
        cnic: '12345-1234567-2',
        role: 'teacher',
        work_mode: 'full_time',
        approved: true,
        created_at: new Date().toISOString()
    }
];

const mockPosts = [
    {
        id: 1,
        title: 'Welcome to Akademi',
        content: 'This is the first post in our new system.',
        author: 'Admin User',
        created_at: new Date().toISOString()
    }
];

export const MockAuthService = {
    async login(email, password) {
        await delay(1000); // Simulate network delay
        
        // Mock login validation
        if (email === 'demo@example.com' && password === '123456') {
            const user = mockUsers.find(u => u.email === email) || mockUsers[0];
            return {
                data: {
                    token: 'mock-jwt-token-' + Date.now(),
                    user: user,
                    expiresIn: 3600
                }
            };
        } else {
            throw new Error('Invalid credentials');
        }
    },

    async signup(userData) {
        await delay(1000);
        
        const newUser = {
            id: mockUsers.length + 1,
            ...userData,
            approved: false,
            created_at: new Date().toISOString()
        };
        
        mockUsers.push(newUser);
        
        return {
            data: {
                token: 'mock-jwt-token-' + Date.now(),
                user: newUser,
                expiresIn: 3600
            }
        };
    }
};

export const MockPostsService = {
    async getPosts() {
        await delay(500);
        return { data: mockPosts };
    },

    async createPost(postData) {
        await delay(500);
        const newPost = {
            id: mockPosts.length + 1,
            ...postData,
            created_at: new Date().toISOString()
        };
        mockPosts.push(newPost);
        return { data: newPost };
    },

    async updatePost(postId, postData) {
        await delay(500);
        const index = mockPosts.findIndex(p => p.id === postId);
        if (index !== -1) {
            mockPosts[index] = { ...mockPosts[index], ...postData };
            return { data: mockPosts[index] };
        }
        throw new Error('Post not found');
    },

    async deletePost(postId) {
        await delay(500);
        const index = mockPosts.findIndex(p => p.id === postId);
        if (index !== -1) {
            mockPosts.splice(index, 1);
            return { data: { success: true } };
        }
        throw new Error('Post not found');
    }
}; 