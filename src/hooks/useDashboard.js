import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserService } from '../services/UserService';

const useDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await UserService.getDashboard();
                if (response.data.success) {
                    setDashboardData(response.data.data.stats);
                } else {
                    throw new Error(response.data.message || 'Failed to fetch dashboard data');
                }
            } catch (err) {
                console.error('Dashboard data fetch error:', err);
                setError(err.message);
                toast.error(err.message || 'An error occurred while fetching dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return { dashboardData, loading, error };
};

export default useDashboard;
