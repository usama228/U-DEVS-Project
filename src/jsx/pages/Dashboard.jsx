import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SVGICON } from '../components/bootstrap/SVGICON';
import PageTitle from '../layouts/PageTitle';
import { getUserDetails } from '../../services/AuthService';
import { UserService } from '../../services/UserService';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserDetails();
        fetchDashboardStats();
        
        // Add class to body to help with styling
        document.body.classList.add('dashboard-page');
        
        return () => {
            document.body.classList.remove('dashboard-page');
        };
    }, []);

    const fetchUserDetails = async () => {
        try {
            const details = getUserDetails();
            setUserDetails(details);
        } catch (error) {
            console.error('Error fetching user details:', error);
            toast.error('Failed to load user details');
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const response = await UserService.getDashboardStats();
            if (response.data.success) {
                setDashboardStats(response.data.data.stats);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            toast.error('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            <div className="container-fluid">
                <PageTitle activeMenu="Dashboard" motherMenu="Home" />
            </div>
            <div className="container-fluid" style={{ paddingTop: '20px' }}>
                <div className="row">
                    <div className="col-12">
                        <div className="row dashboard-stats">
                            {/* User Statistics */}
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-body d-flex align-items-center">
                                        <div className="icon-box bg-primary-light me-3">
                                            <SVGICON icon="people" className="text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1">{dashboardStats?.totalUsers || 0}</h3>
                                            <p className="mb-0">Total Users</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-body d-flex align-items-center">
                                        <div className="icon-box bg-success-light me-3">
                                            <SVGICON icon="school" className="text-success" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1">{dashboardStats?.totalInternees || 0}</h3>
                                            <p className="mb-0">Internees</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-body d-flex align-items-center">
                                        <div className="icon-box bg-warning-light me-3">
                                            <SVGICON icon="supervisor-account" className="text-warning" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1">{dashboardStats?.totalTeamLeads || 0}</h3>
                                            <p className="mb-0">Team Leads</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-body d-flex align-items-center">
                                        <div className="icon-box bg-info-light me-3">
                                            <SVGICON icon="work" className="text-info" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1">{dashboardStats?.totalEmployees || 0}</h3>
                                            <p className="mb-0">Employees</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="row dashboard-stats">
                            {/* Task Statistics */}
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-body d-flex align-items-center">
                                        <div className="icon-box bg-secondary-light me-3">
                                            <SVGICON icon="task" className="text-secondary" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1">{dashboardStats?.totalTasks || 0}</h3>
                                            <p className="mb-0">Total Tasks</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-body d-flex align-items-center">
                                        <div className="icon-box bg-primary-light me-3">
                                            <SVGICON icon="assignment" className="text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1">{dashboardStats?.assignedTasks || 0}</h3>
                                            <p className="mb-0">Assigned</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-body d-flex align-items-center">
                                        <div className="icon-box bg-success-light me-3">
                                            <SVGICON icon="check-circle" className="text-success" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1">{dashboardStats?.acceptedTasks || 0}</h3>
                                            <p className="mb-0">Completed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-body d-flex align-items-center">
                                        <div className="icon-box bg-warning-light me-3">
                                            <SVGICON icon="pending" className="text-warning" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1">{dashboardStats?.submittedTasks || 0}</h3>
                                            <p className="mb-0">Pending Review</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Welcome Card */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="card welcome-card" style={{ 
                                    background: '#4D44B5',
                                    color: 'white',
                                    border: 'none'
                                }}>
                                    <div className="card-body p-4">
                                        <div className="row align-items-center">
                                            <div className="col-12">
                                                <div className="welcome-content">
                                                    <h2 className="mb-3">Welcome back, {userDetails?.user?.firstName || 'Admin'}!</h2>
                                                    <p className="mb-2 fs-5">
                                                        You are logged in as <span className="badge bg-light text-dark ms-1">{userDetails?.user?.role?.replace('_', ' ').toUpperCase() || 'ADMIN'}</span>
                                                    </p>
                                                    <p className="text-light mb-0">
                                                        {new Date().toLocaleString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Quick Actions</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            {userDetails?.user?.role === 'admin' && (
                                                <>
                                                    <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                                                        <Link to="/create-user" className="btn btn-primary btn-block">
                                                            <SVGICON icon="person-add" className="me-2" />
                                                            Create User
                                                        </Link>
                                                    </div>
                                                    <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                                                        <Link to="/create-task" className="btn btn-primary btn-block">
                                                            <SVGICON icon="add-task" className="me-2" />
                                                            Create Task
                                                        </Link>
                                                    </div>
                                                </>
                                            )}
                                            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                                                <Link to="/users" className="btn btn-primary btn-block">
                                                    <SVGICON icon="people" className="me-2" />
                                                    View Users
                                                </Link>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                                                <Link to="/tasks" className="btn btn-primary btn-block">
                                                    <SVGICON icon="task" className="me-2" />
                                                    View Tasks
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;