
import axios from 'axios';
import { API_URL } from '../config';

export function getToken() {
    const tokenDetailsString = localStorage.getItem('userDetails');
    if (!tokenDetailsString) return null;

    try {
        const tokenDetails = JSON.parse(tokenDetailsString);

        // Optional: check if expired
        if (tokenDetails.expireDate) {
            const expireDate = new Date(tokenDetails.expireDate);
            if (new Date() > expireDate) {
                console.warn("Token expired");
                localStorage.removeItem('userDetails');
                return null;
            }
        }

        return tokenDetails.token || null;
    } catch (error) {
        console.error("Error parsing token from localStorage:", error);
        return null;
    }
}

export const getNotifications = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, message: error.response?.data?.message || "Error" };
  }
};

export const markAsRead = async (notificationId) => {
    try {
        const token = getToken();
        const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

export const markAllAsRead = async () => {
    try {
        const token = getToken();
        const response = await axios.put(`${API_URL}/notifications/read-all`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
};
