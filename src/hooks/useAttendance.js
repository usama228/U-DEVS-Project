import { useState, useEffect, useCallback } from 'react';
import { getAttendanceByUser, checkIn, checkOut, getAttendanceByDate } from '../services/AttendanceService';
import { getUserDetails } from '../services/AuthService';
import { toast } from 'react-toastify';

export const useAttendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    const userDetails = getUserDetails();
    const userId = userDetails?.id;

    const fetchAttendanceData = useCallback(async (startDate, endDate) => {
        if (!userId) return;
        
        setLoading(true);
        try {
            const response = await getAttendanceByUser(userId, startDate, endDate);
            if (response.data.success) {
                setAttendanceData(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
            toast.error('Failed to load attendance data');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const fetchTodayAttendance = useCallback(async () => {
        if (!userId) return;
        
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await getAttendanceByDate(today);
            if (response.data.success) {
                const userTodayRecord = response.data.data?.find(record => record.userId === userId);
                setTodayAttendance(userTodayRecord || null);
            }
        } catch (error) {
            console.error('Error fetching today attendance:', error);
        }
    }, [userId]);

    const handleCheckIn = async () => {
        if (!userId) return;
        
        setActionLoading(true);
        try {
            const response = await checkIn(userId);
            if (response.data.success) {
                toast.success('Checked in successfully!');
                fetchTodayAttendance();
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to check in');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
        if (!userId) return;
        
        setActionLoading(true);
        try {
            const response = await checkOut(userId);
            if (response.data.success) {
                toast.success('Checked out successfully!');
                fetchTodayAttendance();
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to check out');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    return {
        attendanceData,
        todayAttendance,
        loading,
        actionLoading,
        fetchAttendanceData,
        fetchTodayAttendance,
        handleCheckIn,
        handleCheckOut,
        userDetails
    };
};