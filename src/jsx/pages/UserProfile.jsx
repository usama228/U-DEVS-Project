import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tab, Nav, Form } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import UserService from '../../services/UserService.js';
import { toast } from 'react-toastify';
import { adminChangePassword, getUserDetails } from '../../services/AuthService.js';
import { IMAGE_URL } from '../../config.js';
import ImageModal from '../../components/ImageModal';
import { IMAGES } from '../constant/theme.js';
import '../../assets/css/modal.css';

const UserProfile = () => {
    const { id } = useParams();
    const [currentUser, setCurrentUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [teamLeads, setTeamLeads] = useState([]);

    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        idCardNumber: '',
        profilePicture: null,
        idCardFrontPic: null,
        idCardBackPic: null
    });
    const [passwordForm, setPasswordForm] = useState({ newPassword: '' });
    const [adminActionsForm, setAdminActionsForm] = useState({ role: '', teamLeadId: '' });

    const [updating, setUpdating] = useState(false);
    const [passwordUpdating, setPasswordUpdating] = useState(false);
    const [adminActionsUpdating, setAdminActionsUpdating] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const user = getUserDetails();
        setCurrentUser(user);

        fetchUserDetails();
        if (user && user.role === 'admin') {
            fetchTeamLeads();
        }
    }, [id]);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const response = await UserService.getUserById(id);
            if (response.data.success) {
                const user = response.data.data.user; 
                setUserDetails(user);
                setProfileForm({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    phone: user.phone || '',
                    idCardNumber: user.idCardNumber || '',
                    profilePicture: null,
                    idCardFrontPic: null,
                    idCardBackPic: null
                });
                setAdminActionsForm({ 
                    role: user.role || '', 
                    teamLeadId: user.teamLead?.id || '' 
                });
            } else {
                toast.error(response.data.message || 'Failed to load user details');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchTeamLeads = async () => {
        try {
            const response = await UserService.getTeamLeads();
            if (response.data.success && Array.isArray(response.data.data.teamLeads)) {
                setTeamLeads(response.data.data.teamLeads);
            } else {
                console.error('Fetching team leads did not return an array:', response.data);
                setTeamLeads([]);
            }
        } catch (error) {
            console.error('Error fetching team leads:', error);
            setTeamLeads([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setProfileForm(prev => ({ ...prev, [name]: files[0] }));
    };
    
    const handleAdminActionsChange = (e) => {
        const { name, value } = e.target;
        setAdminActionsForm(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        const formData = new FormData();
        Object.keys(profileForm).forEach(key => {
            if (profileForm[key]) {
                formData.append(key, profileForm[key]);
            }
        });

        try {
            const response = await UserService.updateUser(id, formData);
            if (response.data.success) {
                toast.success('Profile updated successfully');
                fetchUserDetails();
            } else {
                toast.error(response.data.message || 'Update failed');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'An error occurred during update');
        } finally {
            setUpdating(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPasswordUpdating(true);
        try {
            const response = await adminChangePassword(id, passwordForm.newPassword);
            if (response.data.success) {
                toast.success('Password updated successfully');
                setPasswordForm({ newPassword: '' });
            } else {
                toast.error(response.data.message || 'Password update failed');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error(error.response?.data?.message || 'An error occurred during password update');
        } finally {
            setPasswordUpdating(false);
        }
    };

    const handleStatusToggle = async (e) => {
        const newStatus = e.target.checked;
        try {
            await UserService.updateUserStatus(id, newStatus);
            toast.success(`User has been ${newStatus ? 'activated' : 'deactivated'}.`);
            setUserDetails(prev => ({ ...prev, isActive: newStatus }));
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error.response?.data?.message || 'Failed to update status.');
            fetchUserDetails();
        }
    };
    
    const handleRoleUpdate = async (e) => {
        e.preventDefault();
        
        if (adminActionsForm.role === 'internee' && !adminActionsForm.teamLeadId) {
            toast.error('Please select a team lead for the internee.');
            return;
        }

        setAdminActionsUpdating(true);
        try {
            await UserService.updateUserRole(id, adminActionsForm.role, adminActionsForm.teamLeadId);
            toast.success('User role updated successfully.');
            fetchUserDetails();
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error(error.response?.data?.message || 'Failed to update role.');
        } finally {
            setAdminActionsUpdating(false);
        }
    };

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border"></div></div>;
    }

    if (!userDetails) {
        return <div className="container-fluid"><h4>User not found.</h4></div>;
    }

    return (
        <>
            <PageTitle activeMenu="User Profile" motherMenu="Users" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="profile card card-body px-3 pt-3 pb-0">
                            <div className="profile-head">
                                <div className="photo-content"><div className="cover-photo rounded"></div></div>
                                <div className="profile-info">
                                    <div className="row align-items-center">
                                        <div className="col-auto">
                                            <div className="profile-photo">
                                                <ImageModal
                                                    src={userDetails?.profilePicture ? `${IMAGE_URL}${userDetails.profilePicture}` : IMAGES.avatar}
                                                    alt="Profile"
                                                    className="profile-pic-thumb"
                                                />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="profile-details d-flex flex-wrap align-items-center">
                                                <div className="profile-name me-4 mb-2">
                                                    <h4 className="text-white mb-1 fw-bold">{userDetails.firstName} {userDetails.lastName}</h4>
                                                    <p className="text-black-50 mb-0 small text-capitalize">{userDetails?.role?.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body">
                                <Tab.Container defaultActiveKey="about">
                                    <Nav as="ul" className="nav nav-tabs">
                                        <Nav.Item as="li"><Nav.Link eventKey="about">About User</Nav.Link></Nav.Item>
                                        {currentUser && (currentUser.id.toString() === id || currentUser.role === 'admin') && (
                                            <Nav.Item as="li"><Nav.Link eventKey="edit">Edit Profile</Nav.Link></Nav.Item>
                                        )}
                                        {currentUser && (currentUser.role === 'admin' || (currentUser.role === 'team_lead' && userDetails.role === 'internee' && userDetails.teamLead?.id === currentUser.id)) && (
                                        <Nav.Item as="li"><Nav.Link eventKey="security">Security</Nav.Link></Nav.Item>
                                        )}
                                        {currentUser && currentUser.role === 'admin' && (
                                            <Nav.Item as="li"><Nav.Link eventKey="admin-actions">Admin Actions</Nav.Link></Nav.Item>
                                        )}
                                    </Nav>
                                    <Tab.Content className="pt-3">
                                        <Tab.Pane eventKey="about">
                                            <h4>About {userDetails.firstName}</h4>
                                            <p><strong>Status:</strong> <span className={`badge ${userDetails.isActive ? 'bg-success' : 'bg-danger'}`}>{userDetails.isActive ? 'Active' : 'Inactive'}</span></p>
                                            <div className="row mb-2"><div className="col-md-3"><strong>Full Name:</strong></div><div className="col-md-9">{userDetails.firstName} {userDetails.lastName}</div></div>
                                            <div className="row mb-2"><div className="col-md-3"><strong>Email:</strong></div><div className="col-md-9">{userDetails.email}</div></div>
                                            <div className="row mb-2"><div className="col-md-3"><strong>Phone:</strong></div><div className="col-md-9">{userDetails.phone || 'N/A'}</div></div>
                                            <div className="row mb-2"><div className="col-md-3"><strong>ID Card Number:</strong></div><div className="col-md-9">{userDetails.idCardNumber || 'N/A'}</div></div>
                                            <div className="row mb-2"><div className="col-md-3"><strong>Role:</strong></div><div className="col-md-9 text-capitalize">{userDetails.role?.replace('_', ' ')}</div></div>
                                            {userDetails.teamLead && <div className="row mb-2"><div className="col-md-3"><strong>Team Lead:</strong></div><div className="col-md-9">{userDetails.teamLead.firstName} {userDetails.teamLead.lastName}</div></div>}
                                            <div className="row mt-4">
                                                <div className="col-md-6">
                                                    <h5>ID Card Front</h5>
                                                    <div className="id-card-img-container">
                                                        {userDetails.idCardFrontPic ? <ImageModal src={`${IMAGE_URL}${userDetails.idCardFrontPic}`} alt="ID Card Front" imgClassName="id-card-img"/> : <div className="placeholder-text">Not available</div>}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <h5>ID Card Back</h5>
                                                    <div className="id-card-img-container">
                                                        {userDetails.idCardBackPic ? <ImageModal src={`${IMAGE_URL}${userDetails.idCardBackPic}`} alt="ID Card Back" imgClassName="id-card-img"/> : <div className="placeholder-text">Not available</div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="edit">
                                            <h4>Edit Profile</h4>
                                            <form onSubmit={handleProfileUpdate}>
                                                <div className="row">
                                                    <div className="col-md-6 mb-3"><label>First Name</label><input type="text" name="firstName" className="form-control" value={profileForm.firstName} onChange={handleInputChange} /></div>
                                                    <div className="col-md-6 mb-3"><label>Last Name</label><input type="text" name="lastName" className="form-control" value={profileForm.lastName} onChange={handleInputChange} /></div>
                                                    <div className="col-md-6 mb-3"><label>Phone</label><input type="text" name="phone" className="form-control" value={profileForm.phone} onChange={handleInputChange} /></div>
                                                    <div className="col-md-6 mb-3"><label>ID Card Number</label><input type="text" name="idCardNumber" className="form-control" value={profileForm.idCardNumber} onChange={handleInputChange} /></div>
                                                    <div className="col-md-4 mb-3"><label>Profile Picture</label><input type="file" name="profilePicture" className="form-control" onChange={handleFileChange} /></div>
                                                    <div className="col-md-4 mb-3"><label>ID Card Front</label><input type="file" name="idCardFrontPic" className="form-control" onChange={handleFileChange} /></div>
                                                    <div className="col-md-4 mb-3"><label>ID Card Back</label><input type="file" name="idCardBackPic" className="form-control" onChange={handleFileChange} /></div>
                                                </div>
                                                <button type="submit" className="btn btn-primary" disabled={updating}>{updating ? 'Updating...' : 'Update Profile'}</button>
                                            </form>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="security">
                                            <h4>Change Password</h4>
                                            <form onSubmit={handlePasswordUpdate}>
                                                <div className="row">
                                                    <div className="col-md-6 mb-3 position-relative">
                                                        <label>New Password</label>
                                                        <input type={showPassword ? "text" : "password"} name="newPassword" className="form-control" value={passwordForm.newPassword} onChange={handlePasswordChange} />
                                                        <span className="position-absolute end-0 translate-middle-y"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            style={{
                                                                cursor: "pointer",
                                                                paddingRight: "1.7rem",
                                                                transform: "translateY(-50%)",
                                                                paddingBottom: "2.5rem"
                                                            }}>
                                                            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                                        </span>
                                                    </div>
                                                </div>
                                                <button type="submit" className="btn btn-primary" disabled={passwordUpdating}>{passwordUpdating ? 'Updating Password...' : 'Update Password'}</button>
                                            </form>
                                        </Tab.Pane>
                                        {currentUser && currentUser.role === 'admin' && (
                                            <Tab.Pane eventKey="admin-actions">
                                                <h4>Admin Controls</h4>
                                                <div className="mb-3">
                                                    <Form.Check
                                                        type="switch"
                                                        id="status-switch"
                                                        label={userDetails.isActive ? 'Active' : 'Inactive'}
                                                        checked={userDetails.isActive}
                                                        onChange={handleStatusToggle}
                                                    />
                                                </div>
                                                <hr />
                                                <form onSubmit={handleRoleUpdate}>
                                                    <div className="row">
                                                        <div className="col-md-6 mb-3">
                                                            <label>Role</label>
                                                            <select name="role" className="form-control" value={adminActionsForm.role} onChange={handleAdminActionsChange}>
                                                                <option value="admin">Admin</option>
                                                                <option value="team_lead">Team Lead</option>
                                                                <option value="employee">Employee</option>
                                                                <option value="internee">Internee</option>
                                                            </select>
                                                        </div>
                                                        {adminActionsForm.role === 'internee' && (
                                                            <div className="col-md-6 mb-3">
                                                                <label>Team Lead</label>
                                                                <select name="teamLeadId" className="form-control" value={adminActionsForm.teamLeadId} onChange={handleAdminActionsChange} required>
                                                                    <option value="">Select Team Lead</option>
                                                                    {teamLeads.map(lead => (
                                                                        <option key={lead.id} value={lead.id}>{lead.firstName} {lead.lastName}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button type="submit" className="btn btn-primary" disabled={adminActionsUpdating}>
                                                        {adminActionsUpdating ? 'Updating Role...' : 'Update Role'}
                                                    </button>
                                                </form>
                                            </Tab.Pane>
                                        )}
                                    </Tab.Content>
                                </Tab.Container>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;
