import { useState, useEffect, useCallback } from 'react';
import { getLeaves, getLeavesByUser, createLeave, updateLeaveStatus, deleteLeave } from '../services/LeaveService';
import { getUserDetails } from '../services/AuthService';
import { toast } from 'react-toastify';

export const useLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    const userDetails = getUserDetails();
    const userId = userDetails?.id;
    const userRole = userDetails?.role;

    const fetchLeaves = useCallback(async () => {
        if (!userId) return;
        
        setLoading(true);
        try {
            const response = userRole === 'admin' || userRole === 'team_lead' 
                ? await getLeaves() 
                : await getLeavesByUser(userId);
            
            if (response.data.success) {
                setLeaves(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
            toast.error('Failed to load leaves data');
        } finally {
            setLoading(false);
        }
    }, [userId, userRole]);

    const submitLeave = async (leaveData) => {
        setActionLoading(true);
        try {
            const response = await createLeave({ ...leaveData, userId });
            if (response.data.success) {
                toast.success('Leave request submitted successfully!');
                fetchLeaves();
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit leave request');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    const updateStatus = async (leaveId, status, rejectionReason = null) => {
        setActionLoading(true);
        try {
            const response = await updateLeaveStatus(leaveId, status, rejectionReason);
            if (response.data.success) {
                toast.success(`Leave ${status} successfully!`);
                fetchLeaves();
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update leave status');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    const removeLeave = async (leaveId) => {
        setActionLoading(true);
        try {
            const response = await deleteLeave(leaveId);
            if (response.data.success) {
                toast.success('Leave deleted successfully!');
                fetchLeaves();
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete leave');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    return {
        leaves,
        loading,
        actionLoading,
        fetchLeaves,
        submitLeave,
        updateStatus,
        removeLeave,
        userDetails,
        userRole
    };
};