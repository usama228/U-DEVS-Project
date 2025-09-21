import React from 'react';
import { Link } from 'react-router-dom';
import { SVGICON } from '../components/bootstrap/SVGICON';
import PageTitle from '../layouts/PageTitle';
import useDashboard from '../../hooks/useDashboard';
import { getUserDetails } from '../../services/AuthService';

const Dashboard = () => {
    const { dashboardData, loading, error } = useDashboard();
    const userDetails = getUserDetails();
    const userRole = userDetails?.role;

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

    const renderDashboardContent = () => {
        if (!dashboardData) return null;

        switch (userRole) {
            case 'admin':
                return (
                    <>
                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-body d-flex align-items-center">
                                        <div className="icon-box bg-primary-light me-3">
                                            <SVGICON icon="people" className="text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1">{dashboardData.totalUsers || 0}</h3>
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
                                            <h3 className="mb-1">{dashboardData.totalInternees || 0}</h3>
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
                                            <h3 className="mb-1">{dashboardData.totalTeamLeads || 0}</h3>
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
                                            <h3 className="mb-1">{dashboardData.totalEmployees || 0}</h3>
                                            <p className="mb-0">Employees</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-body d-flex align-items-center">
                                        <div className="icon-box bg-secondary-light me-3">
                                            <SVGICON icon="task" className="text-secondary" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1">{dashboardData.totalTasks || 0}</h3>
                                            <p className="mb-0">Total Tasks</p>
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
                                            <h3 className="mb-1">{dashboardData.pendingTasks || 0}</h3>
                                            <p className="mb-0">Pending Tasks</p>
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
                                            <h3 className="mb-1">{dashboardData.completedTasks || 0}</h3>
                                            <p className="mb-0">Completed Tasks</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-body d-flex align-items-center">
                                        <div className="icon-box bg-danger-light me-3">
                                            <SVGICON icon="cancel" className="text-danger" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1">{dashboardData.rejectedTasks || 0}</h3>
                                            <p className="mb-0">Rejected Tasks</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 'team_lead':
                return (
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="card">
                                <div className="card-body d-flex align-items-center">
                                    <div className="icon-box bg-primary-light me-3">
                                        <SVGICON icon="group" className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1">{dashboardData.totalInternees || 0}</h3>
                                        <p className="mb-0">My Internees</p>
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
                                        <h3 className="mb-1">{dashboardData.activeInternees || 0}</h3>
                                        <p className="mb-0">Active Internees</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="card">
                                <div className="card-body d-flex align-items-center">
                                    <div className="icon-box bg-info-light me-3">
                                        <SVGICON icon="assignment" className="text-info" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1">{dashboardData.totalTasks || 0}</h3>
                                        <p className="mb-0">Tasks Assigned</p>
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
                                        <h3 className="mb-1">{dashboardData.pendingTasks || 0}</h3>
                                        <p className="mb-0">Pending Review</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'employee':
                return <></>;
            case 'internee':
                return (
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="card">
                                <div className="card-body d-flex align-items-center">
                                    <div className="icon-box bg-primary-light me-3">
                                        <SVGICON icon="assignment" className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1">{dashboardData.totalTasks || 0}</h3>
                                        <p className="mb-0">My Tasks</p>
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
                                        <h3 className="mb-1">{dashboardData.pendingTasks || 0}</h3>
                                        <p className="mb-0">Pending Tasks</p>
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
                                        <h3 className="mb-1">{dashboardData.completedTasks || 0}</h3>
                                        <p className="mb-0">Completed Tasks</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="card">
                                <div className="card-body d-flex align-items-center">
                                    <div className="icon-box bg-info-light me-3">
                                        <SVGICON icon="thumb-up" className="text-info" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1">{dashboardData.acceptedTasks || 0}</h3>
                                        <p className="mb-0">Accepted Tasks</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div>Welcome to your dashboard!</div>;
        }
    };

    const renderQuickActions = () => {
        switch (userRole) {
            case 'admin':
                return (
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                            <Link to="/create-user" className="btn btn-primary btn-block w-100">
                                <SVGICON icon="person-add" className="me-2" />
                                Create User
                            </Link>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                            <Link to="/create-task" className="btn btn-primary btn-block w-100">
                                <SVGICON icon="add-task" className="me-2" />
                                Create Task
                            </Link>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                            <Link to="/users" className="btn btn-primary btn-block w-100">
                                <SVGICON icon="people" className="me-2" />
                                All Users
                            </Link>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                            <Link to="/all-tasks" className="btn btn-primary btn-block w-100">
                                <SVGICON icon="task" className="me-2" />
                                All Tasks
                            </Link>
                        </div>
                    </div>
                );
            case 'team_lead':
                return (
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                            <Link to="/create-task" className="btn btn-primary btn-block w-100">
                                <SVGICON icon="add-task" className="me-2" />
                                Create Task
                            </Link>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                            <Link to="/interns" className="btn btn-primary btn-block w-100">
                                <SVGICON icon="school" className="me-2" />
                                My Internees
                            </Link>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                            <Link to="/all-tasks" className="btn btn-primary btn-block w-100">
                                <SVGICON icon="task" className="me-2" />
                                Manage Tasks
                            </Link>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                            <Link to="/profile" className="btn btn-primary btn-block w-100">
                                <SVGICON icon="person" className="me-2" />
                                My Profile
                            </Link>
                        </div>
                    </div>
                );
            case 'employee':
            case 'internee':
                return (
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                            <Link to="/my-tasks" className="btn btn-primary btn-block w-100">
                                <SVGICON icon="assignment" className="me-2" />
                                My Tasks
                            </Link>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                            <Link to="/profile" className="btn btn-primary btn-block w-100">
                                <SVGICON icon="person" className="me-2" />
                                My Profile
                            </Link>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="dashboard-wrapper">
            <div className="container-fluid">
                <PageTitle activeMenu="Dashboard" motherMenu="Home" />
            </div>

            <div className="container-fluid" style={{ paddingTop: '20px' }}>
                <div className="row">
                    <div className="col-12">
                        {/* Welcome Card */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="card welcome-card" style={{ background: '#4D44B5', color: 'white', border: 'none' }}>
                                    <div className="card-body p-4">
                                        <h2 className="mb-3 text-light">Welcome back, {userDetails?.firstName || 'User'}!</h2>
                                        <p className="mb-2 fs-5">
                                            You are logged in as{' '}
                                            <span className="badge bg-light text-dark ms-1">
                                                {userRole?.replace('_', ' ').toUpperCase() || 'USER'}
                                            </span>
                                        </p>
                                        <p className="text-light mb-0">
                                            {new Date().toLocaleString('en-US', {
                                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Role-based Dashboard Content */}
                        {renderDashboardContent()}

                        {/* Quick Actions */}
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Quick Actions</h4>
                                    </div>
                                    <div className="card-body">
                                        {renderQuickActions()}
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