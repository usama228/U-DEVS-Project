import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Pagination } from 'react-bootstrap';
import { IMAGES } from '../constant/theme';
import PageTitle from '../layouts/PageTitle';
import { getUserDetails } from '../../services/AuthService';
import { UserService } from '../../services/UserService';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { IMAGE_URL } from '../../config';
import ImageModal from '../../components/ImageModal';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    
    // Pagination and search state
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const debouncedSearch = useCallback(debounce((value) => {
        setSearch(value);
        setCurrentPage(1); 
    }, 500), []);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: 10,
                search,
                role: roleFilter,
                status: statusFilter,
            };
            const response = await UserService.getAllUsers(params);
            if (response.data.success) {
                setUsers(response.data.data.users);
                setTotalPages(response.data.data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [currentPage, search, roleFilter, statusFilter]);

    useEffect(() => {
        const userDetails = getUserDetails();
        setCurrentUser(userDetails);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await UserService.deleteUser(userId);
                toast.success('User deleted successfully');
                fetchUsers(); // Refresh the user list
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user');
            }
        }
    };

    const getRoleBadgeClass = (role) => {
        const roles = { admin: 'badge-danger', team_lead: 'badge-warning', employee: 'badge-info', internee: 'badge-success' };
        return roles[role] || 'badge-secondary';
    };

    const formatRole = (role) => role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <>
            <PageTitle activeMenu="Users" motherMenu="User Management" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title">All Users</h4>
                                {currentUser?.role === 'admin' && (
                                    <Link to="/create-user" className="btn btn-primary">Create User</Link>
                                )}
                            </div>
                            <div className="card-body">
                                <div className="mb-3 d-flex justify-content-between align-items-center">
                                    <div className="w-50">
                                        <input 
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by name or email..."
                                            onChange={(e) => debouncedSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="d-flex">
                                        <select className="form-control me-2" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}>
                                            <option value="">All Roles</option>
                                            <option value="admin">Admin</option>
                                            <option value="team_lead">Team Lead</option>
                                            <option value="employee">Employee</option>
                                            <option value="internee">Internee</option>
                                        </select>
                                        <select className="form-control" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                                            <option value="">All Statuses</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Contact</th>
                                                <th>Role</th>
                                                <th>Team Lead</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                                            ) : users.length === 0 ? (
                                                <tr><td colSpan="6" className="text-center">No users found</td></tr>
                                            ) : (
                                                users.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <ImageModal
                                                                    src={user.profilePicture ? `${IMAGE_URL}${user.profilePicture}` : IMAGES.avatar}
                                                                    alt={`${user.firstName} ${user.lastName}`}
                                                                    className="avatar avatar-md rounded-circle"
                                                                />
                                                                <div className="ms-3">
                                                                    <h6 className="mb-0">{user.firstName} {user.lastName}</h6>
                                                                    <small className="text-muted">{user.email}</small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>{user.phone}</div>
                                                            <small className="text-muted">ID: {user.idCardNumber}</small>
                                                        </td>
                                                        <td><span className={`badge ${getRoleBadgeClass(user.role)}`}>{formatRole(user.role)}</span></td>
                                                        <td>{user.teamLead ? `${user.teamLead.firstName} ${user.teamLead.lastName}` : '-'}</td>
                                                        <td><span className={`badge ${user.isActive ? 'badge-success' : 'badge-secondary'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                                                        <td>
                                                            <Link to={`/user-profile/${user.id}`} className="btn btn-primary btn-sm me-2">View Profile</Link>
                                                            {currentUser?.role === 'admin' && (
                                                                <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">Delete</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 1 && (
                                    <Pagination className="justify-content-center">
                                        {[...Array(totalPages).keys()].map(num => (
                                            <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => handlePageChange(num + 1)}>
                                                {num + 1}
                                            </Pagination.Item>
                                        ))}
                                    </Pagination>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Users;
