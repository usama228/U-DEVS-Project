import React from 'react';
import useDashboard from '../../hooks/useDashboard';
import UserDistributionChart from '../components/Dashboard/Elements/UserDistributionChart';
import TaskStatusChart from '../components/Dashboard/Elements/TaskStatusChart';

const Analysis = () => {
    const { dashboardData, loading, error } = useDashboard();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="row">
            <div className="col-xl-6">
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">User Distribution</h4>
                    </div>
                    <div className="card-body">
                        {dashboardData && <UserDistributionChart data={dashboardData} />}
                    </div>
                </div>
            </div>
            <div className="col-xl-6">
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Task Status</h4>
                    </div>
                    <div className="card-body">
                        {dashboardData && <TaskStatusChart data={dashboardData} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analysis;
