import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Modal } from 'react-bootstrap';
import { IMAGES } from '../constant/theme';
import PageTitle from '../layouts/PageTitle';
import { getUserDetails } from '../../services/AuthService';
import { UserService } from '../../services/UserService';
import { toast } from 'react-toastify';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [teamLeads, setTeamLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'edit', 'delete', 'view', 'status', 'role'
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({ role: '', teamLeadId: '', isActive: true });
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        fetchUsers();
        fetchTeamLeads();
        const userDetails = getUserDetails();
        setCurrentUser(userDetails);
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await UserService.getAllUsers();
            if (response.data.success) {
                setUsers(response.data.data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const fetchTeamLeads = async () => {
        try {
            const response = await UserService.getTeamLeads();
            if (response.data.success) {
                setTeamLeads(response.data.data.teamLeads);
            }
        } catch (error) {
            console.error('Error fetching team leads:', error);
        }
    };

    const handleShowModal = (type, user = null) => {
        setModalType(type);
        setSelectedUser(user);
        if (user) {
            setFormData({
                role: user.role || '',
                teamLeadId: user.teamLeadId || '',
                isActive: user.isActive !== undefined ? user.isActive : true
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setModalType('');
        setFormData({ role: '', teamLeadId: '', isActive: true });
        setValidationErrors({});
    };

    const handleUpdateStatus = async () => {
        try {
            const response = await UserService.updateUserStatus(selectedUser.id, formData.isActive);
            if (response.data.success) {
                toast.success(response.data.message);
                fetchUsers();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error('Failed to update user status');
        }
    };

    const validateRoleUpdate = () => {
        const errors = {};
        
        // Role validation
        if (!formData.role || formData.role.trim() === '') {
            errors.role = 'Role is required';
        } else if (!['admin', 'team_lead', 'employee', 'internee'].includes(formData.role)) {
            errors.role = 'Please select a valid role';
        }
        
        // Team Lead validation for internees
        if (formData.role === 'internee') {
            if (!formData.teamLeadId || formData.teamLeadId.trim() === '') {
                errors.teamLeadId = 'Team Lead is required for internees';
            }
        }
        
        return errors;
    };

    const handleUpdateRole = async () => {
        // Validate the form before submission
        const errors = validateRoleUpdate();
        setValidationErrors(errors);
        
        if (Object.keys(errors).length > 0) {
            // Display validation errors
            Object.values(errors).forEach(error => {
                toast.error(error);
            });
            return;
        }

        try {
            const response = await UserService.updateUserRole(
                selectedUser.id, 
                formData.role, 
                formData.teamLeadId || null
            );
            if (response.data.success) {
                toast.success(response.data.message);
                fetchUsers();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error updating user role:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update user role';
            toast.error(errorMessage);
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin': return 'badge-danger';
            case 'team_lead': return 'badge-warning';
            case 'employee': return 'badge-info';
            case 'internee': return 'badge-success';
            default: return 'badge-secondary';
        }
    };

    const formatRole = (role) => {
        return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <>
            <div className="container-fluid">
                <PageTitle activeMenu="Users" motherMenu="User Management" />
            </div>
            <div className="dashboard-wrapper">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h4 className="card-title">All Users</h4>
                                    {currentUser?.user?.role === 'admin' && (
                                        <Link to="/create-user" className="btn btn-primary">
                                            Create User
                                        </Link>
                                    )}
                                </div>
                                <div className="card-body">
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
                                                    <tr>
                                                        <td colSpan="6" className="text-center">
                                                            <div className="spinner-border" role="status">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : users.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" className="text-center">No users found</td>
                                                    </tr>
                                                ) : (
                                                    users.map((user, index) => (
                                                        <tr key={user.id}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <img 
                                                                        src={user.profilePicture ? `http://localhost:5000${user.profilePicture}` : IMAGES.contact6} 
                                                                        className="avatar avatar-md" 
                                                                        alt="User" 
                                                                    />
                                                                    <div className="ms-3">
                                                                        <h6 className="mb-0">{user.firstName} {user.lastName}</h6>
                                                                        <small className="text-muted">{user.email}</small>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <div>{user.phone}</div>
                                                                    <small className="text-muted">ID: {user.idCardNumber}</small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                                                    {formatRole(user.role)}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {user.teamLead ? (
                                                                    <div>
                                                                        <div>{user.teamLead.firstName} {user.teamLead.lastName}</div>
                                                                        <small className="text-muted">{user.teamLead.email}</small>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-muted">-</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${user.isActive ? 'badge-success' : 'badge-secondary'}`}>
                                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <Dropdown className="dropdown ms-auto">
                                                                    <Dropdown.Toggle
                                                                        variant=""
                                                                        className="btn-link i-false"
                                                                        data-bs-toggle="dropdown"
                                                                        aria-expanded="false"
                                                                        style={{ border: 'none', background: 'transparent', padding: '5px' }}
                                                                    >
                                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#495057' }}>
                                                                            <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor"/>
                                                                            <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" fill="currentColor"/>
                                                                            <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" fill="currentColor"/>
                                                                        </svg>
                                                                    </Dropdown.Toggle>
                                                                    <Dropdown.Menu className="dropdown-menu-end">
                                                                        <Dropdown.Item onClick={() => handleShowModal('view', user)}>
                                                                            <i className="material-symbols-outlined me-2">visibility</i>
                                                                            View Details
                                                                        </Dropdown.Item>
                                                                        {currentUser?.user?.role === 'admin' && (
                                                                            <>
                                                                                <Dropdown.Item onClick={() => handleShowModal('status', user)}>
                                                                                    <i className="material-symbols-outlined me-2">toggle_on</i>
                                                                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                                                                </Dropdown.Item>
                                                                                <Dropdown.Item onClick={() => handleShowModal('role', user)}>
                                                                                    <i className="material-symbols-outlined me-2">admin_panel_settings</i>
                                                                                    Role & Team Assignment
                                                                                </Dropdown.Item>
                                                                            </>
                                                                        )}
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for user actions */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === 'view' && 'User Details'}
                        {modalType === 'status' && 'Update User Status'}
                        {modalType === 'role' && 'Role & Team Assignment'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalType === 'view' && selectedUser && (
                        <div>
                            <div className="text-center mb-3">
                                <img 
                                    src={selectedUser.profilePicture ? `http://localhost:5000${selectedUser.profilePicture}` : IMAGES.contact6} 
                                    className="avatar avatar-xl" 
                                    alt="User" 
                                />
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <strong>Name:</strong>
                                    <p>{selectedUser.firstName} {selectedUser.lastName}</p>
                                </div>
                                <div className="col-6">
                                    <strong>Email:</strong>
                                    <p>{selectedUser.email}</p>
                                </div>
                                <div className="col-6">
                                    <strong>Phone:</strong>
                                    <p>{selectedUser.phone}</p>
                                </div>
                                <div className="col-6">
                                    <strong>ID Card:</strong>
                                    <p>{selectedUser.idCardNumber}</p>
                                </div>
                                <div className="col-6">
                                    <strong>Role:</strong>
                                    <p>{formatRole(selectedUser.role)}</p>
                                </div>
                                <div className="col-6">
                                    <strong>Status:</strong>
                                    <p>{selectedUser.isActive ? 'Active' : 'Inactive'}</p>
                                </div>
                                {selectedUser.teamLead && (
                                    <div className="col-12">
                                        <strong>Team Lead:</strong>
                                        <p>{selectedUser.teamLead.firstName} {selectedUser.teamLead.lastName}</p>
                                    </div>
                                )}
                                <div className="col-12">
                                    <strong>Joined:</strong>
                                    <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {modalType === 'status' && selectedUser && (
                        <div>
                            <p>Update status for <strong>{selectedUser.firstName} {selectedUser.lastName}</strong></p>
                            <div className="form-group">
                                <label>Status:</label>
                                <select 
                                    className="form-control"
                                    value={formData.isActive}
                                    onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                                >
                                    <option value={true}>Active</option>
                                    <option value={false}>Inactive</option>
                                </select>
                            </div>
                        </div>
                    )}
                     {modalType === 'role' && selectedUser && (
                        <div>
                            <p>Update role for <strong>{selectedUser.firstName} {selectedUser.lastName}</strong></p>
                            <div className="form-group mb-3">
                                <label>Role: <span className="text-danger">*</span></label>
                                <select 
                                    className={`form-control ${validationErrors.role ? 'is-invalid' : ''}`}
                                    value={formData.role}
                                    onChange={(e) => {
                                        setFormData({...formData, role: e.target.value});
                                        // Clear validation error when user makes a selection
                                        if (validationErrors.role) {
                                            setValidationErrors({...validationErrors, role: ''});
                                        }
                                    }}
                                >
                                    <option value="">Select Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="team_lead">Team Lead</option>
                                    <option value="employee">Employee</option>
                                    <option value="internee">Internee</option>
                                </select>
                                {validationErrors.role && <div className="invalid-feedback">{validationErrors.role}</div>}
                            </div>
                            {formData.role === 'internee' && (
                                <div className="form-group">
                                    <label>Team Lead: <span className="text-danger">*</span></label>
                                    <select 
                                        className={`form-control ${validationErrors.teamLeadId ? 'is-invalid' : ''}`}
                                        value={formData.teamLeadId}
                                        onChange={(e) => {
                                            setFormData({...formData, teamLeadId: e.target.value});
                                            // Clear validation error when user makes a selection
                                            if (validationErrors.teamLeadId) {
                                                setValidationErrors({...validationErrors, teamLeadId: ''});
                                            }
                                        }}
                                    >
                                        <option value="">Select Team Lead</option>
                                        {teamLeads.map(lead => (
                                            <option key={lead.id} value={lead.id}>
                                                {lead.firstName} {lead.lastName}
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.teamLeadId && <div className="invalid-feedback">{validationErrors.teamLeadId}</div>}
                                    <small className="form-text text-muted">Required when role is Internee</small>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                        Cancel
                    </button>
                    {modalType === 'status' && (
                        <button type="button" className="btn btn-primary" onClick={handleUpdateStatus}>
                            Update Status
                        </button>
                    )}
                    {modalType === 'role' && (
                        <button type="button" className="btn btn-primary" onClick={handleUpdateRole}>
                            Update Role
                        </button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Users;