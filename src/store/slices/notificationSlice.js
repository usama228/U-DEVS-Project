import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUnreadNotifications = createAsyncThunk(
  'notifications/fetchUnread',
  async (_, { getState }) => {
    const { auth: { token } } = getState();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get('/api/notifications/unread', config);
    return response.data.data.notifications;
  }
);

export const markNotificationsAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationIds, { getState }) => {
    const { auth: { token } } = getState();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.post('/api/notifications/mark-read', { notificationIds }, config);
    return notificationIds;
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload;
        state.unreadCount = action.payload.length;
      })
      .addCase(fetchUnreadNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(markNotificationsAsRead.fulfilled, (state, action) => {
        const idsToMark = action.payload;
        state.notifications = state.notifications.filter(n => !idsToMark.includes(n.id));
        state.unreadCount = state.notifications.length;
      });
  },
});

export default notificationSlice.reducer;
