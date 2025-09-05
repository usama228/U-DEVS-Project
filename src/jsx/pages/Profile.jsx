import React, { useState, useEffect } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import { SVGICON } from '../components/bootstrap/SVGICON';
import PageTitle from '../layouts/PageTitle';
import { updateProfile, changePassword, getProfile } from '../../services/AuthService';
import { toast } from 'react-toastify';

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');
    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        profilePicture: null,
        idCardFrontPic: null,
        idCardBackPic: null
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchUserDetails();
        
        // Add class to body to help with styling
        document.body.classList.add('profile-page');
        
        return () => {
            document.body.classList.remove('profile-page');
        };
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await getProfile();
            if (response.data.success) {
                const user = response.data.data.user;
                setUserDetails(user);
                setProfileForm({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    phone: user.phone || '',
                    profilePicture: null,
                    idCardFrontPic: null,
                    idCardBackPic: null
                });
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            toast.error('Failed to load user details');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
            toast.error('First name and last name are required');
            return;
        }
        
        if (profileForm.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(profileForm.phone)) {
            toast.error('Please enter a valid phone number');
            return;
        }
        
        setUpdating(true);
        try {
            const formData = new FormData();
            Object.keys(profileForm).forEach(key => {
                if (profileForm[key] !== null && profileForm[key] !== '') {
                    formData.append(key, profileForm[key]);
                }
            });
            
            const response = await updateProfile(formData);
            if (response.data.success) {
                toast.success('Profile updated successfully');
                fetchUserDetails();
                // Reset file inputs
                setProfileForm(prev => ({
                    ...prev,
                    profilePicture: null,
                    idCardFrontPic: null,
                    idCardBackPic: null
                }));
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!passwordForm.currentPassword.trim()) {
            toast.error('Current password is required');
            return;
        }
        
        if (passwordForm.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters long');
            return;
        }
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        
        setUpdating(true);
        try {
            const response = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            if (response.data.success) {
                toast.success('Password changed successfully');
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setUpdating(false);
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
        <div className="profile-wrapper">
            <div className="container-fluid">
                <PageTitle activeMenu="Profile" motherMenu="User Management" />
            </div>
            <div className="container-fluid" style={{ paddingTop: '20px' }}>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="profile card card-body px-3 pt-3 pb-0">
                            <div className="profile-head">
                                <div className="photo-content">
                                    <div className="cover-photo rounded"></div>
                                </div>
                                <div className="profile-info">
                                    <div className="row align-items-center">
                                        <div className="col-auto">
                                            <div className="profile-photo">
                                                <img 
                                                    src={userDetails?.profilePicture ? `http://localhost:5000${userDetails.profilePicture}` : `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#6c757d"/><text x="50" y="50" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dy=".3em">User</text></svg>')}`} 
                                                    alt="Profile"
                                                    onError={(e) => {
                                                        e.target.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#6c757d"/><text x="50" y="50" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dy=".3em">User</text></svg>')}`;
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="profile-details d-flex flex-wrap align-items-center">
                                                <div className="profile-name me-4 mb-2">
                                                    <h4 className="text-white mb-1 fw-bold">
                                                        {userDetails?.firstName} {userDetails?.lastName}
                                                    </h4>
                                                    <p className="text-white-50 mb-0 small">{userDetails?.role?.replace('_', ' ').toUpperCase()}</p>
                                                </div>
                                                <div className="profile-email me-4 mb-2">
                                                    <h5 className="text-white mb-1">{userDetails?.email}</h5>
                                                    <p className="text-white-50 mb-0 small">Email</p>
                                                </div>
                                                <div className="profile-phone mb-2">
                                                    <h5 className="text-white mb-1">{userDetails?.phone}</h5>
                                                    <p className="text-white-50 mb-0 small">Phone</p>
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
                                <div className="profile-tab">
                                    <div className="custom-tab-1">
                                        <Tab.Container defaultActiveKey="about">
                                            <Nav as="ul" className="nav nav-tabs">
                                                <Nav.Item as="li" className="nav-item">
                                                    <Nav.Link eventKey="about">About Me</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li" className="nav-item">
                                                    <Nav.Link eventKey="timeline">Edit Profile</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li" className="nav-item">
                                                    <Nav.Link eventKey="password">Change Password</Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                            <Tab.Content className="pt-3">
                                                <Tab.Pane eventKey="about">
                                                    <div className="profile-about-me">
                                                        <div className="pt-3">
                                                            <div className="row mb-2">
                                                                <div className="col-3">
                                                                    <h5 className="f-w-500">Full Name <span className="pull-right">:</span></h5>
                                                                </div>
                                                                <div className="col-9">
                                                                    <span>{userDetails?.firstName} {userDetails?.lastName}</span>
                                                                </div>
                                                            </div>
                                                            <div className="row mb-2">
                                                                <div className="col-3">
                                                                    <h5 className="f-w-500">Email <span className="pull-right">:</span></h5>
                                                                </div>
                                                                <div className="col-9">
                                                                    <span>{userDetails?.email}</span>
                                                                </div>
                                                            </div>
                                                            <div className="row mb-2">
                                                                <div className="col-3">
                                                                    <h5 className="f-w-500">Phone <span className="pull-right">:</span></h5>
                                                                </div>
                                                                <div className="col-9">
                                                                    <span>{userDetails?.phone}</span>
                                                                </div>
                                                            </div>
                                                            <div className="row mb-2">
                                                                <div className="col-3">
                                                                    <h5 className="f-w-500">ID Card <span className="pull-right">:</span></h5>
                                                                </div>
                                                                <div className="col-9">
                                                                    <span>{userDetails?.idCardNumber}</span>
                                                                </div>
                                                            </div>
                                                            <div className="row mb-2">
                                                                <div className="col-3">
                                                                    <h5 className="f-w-500">Role <span className="pull-right">:</span></h5>
                                                                </div>
                                                                <div className="col-9">
                                                                    <span>{userDetails?.role?.replace('_', ' ').toUpperCase()}</span>
                                                                </div>
                                                            </div>
                                                            {userDetails?.teamLead && (
                                                                <div className="row mb-2">
                                                                    <div className="col-3">
                                                                        <h5 className="f-w-500">Team Lead <span className="pull-right">:</span></h5>
                                                                    </div>
                                                                    <div className="col-9">
                                                                        <span>{userDetails.teamLead.firstName} {userDetails.teamLead.lastName}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="row mb-2">
                                                                <div className="col-3">
                                                                    <h5 className="f-w-500">Status <span className="pull-right">:</span></h5>
                                                                </div>
                                                                <div className="col-9">
                                                                    <span className={`badge ${userDetails?.isActive ? 'bg-success text-white' : 'bg-secondary text-white'} px-3 py-2`}>
                                                                        {userDetails?.isActive ? 'Active' : 'Inactive'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="row mb-2">
                                                                <div className="col-3">
                                                                    <h5 className="f-w-500">Joined <span className="pull-right">:</span></h5>
                                                                </div>
                                                                <div className="col-9">
                                                                    <span>{new Date(userDetails?.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="timeline">
                                                    <div className="profile-edit">
                                                        <form onSubmit={handleProfileUpdate}>
                                                            <div className="row">
                                                                <div className="col-lg-6 col-md-6">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label">First Name <span className="text-danger">*</span></label>
                                                                        <input 
                                                                            type="text" 
                                                                            className="form-control"
                                                                            value={profileForm.firstName}
                                                                            onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                                                                            placeholder="Enter first name"
                                                                            required
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label">Last Name <span className="text-danger">*</span></label>
                                                                        <input 
                                                                            type="text" 
                                                                            className="form-control"
                                                                            value={profileForm.lastName}
                                                                            onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                                                                            placeholder="Enter last name"
                                                                            required
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label">Phone Number</label>
                                                                        <input 
                                                                            type="tel" 
                                                                            className="form-control"
                                                                            value={profileForm.phone}
                                                                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                                                            placeholder="Enter phone number"
                                                                        />
                                                                        <small className="form-text text-muted">Format: +1234567890</small>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label">Profile Picture</label>
                                                                        <input 
                                                                            type="file" 
                                                                            className="form-control"
                                                                            accept="image/jpeg,image/jpg,image/png,image/gif"
                                                                            onChange={(e) => setProfileForm({...profileForm, profilePicture: e.target.files[0]})}
                                                                        />
                                                                        <small className="form-text text-muted">Accepted formats: JPG, PNG, GIF (Max: 5MB)</small>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label">ID Card Front Picture</label>
                                                                        <input 
                                                                            type="file" 
                                                                            className="form-control"
                                                                            accept="image/jpeg,image/jpg,image/png"
                                                                            onChange={(e) => setProfileForm({...profileForm, idCardFrontPic: e.target.files[0]})}
                                                                        />
                                                                        <small className="form-text text-muted">Upload front side of ID card</small>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label">ID Card Back Picture</label>
                                                                        <input 
                                                                            type="file" 
                                                                            className="form-control"
                                                                            accept="image/jpeg,image/jpg,image/png"
                                                                            onChange={(e) => setProfileForm({...profileForm, idCardBackPic: e.target.files[0]})}
                                                                        />
                                                                        <small className="form-text text-muted">Upload back side of ID card</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <button type="submit" className="btn btn-primary btn-lg" disabled={updating}>
                                                                    {updating ? (
                                                                        <>
                                                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                                            Updating...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <SVGICON icon="save" className="me-2" />
                                                                            Update Profile
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="password">
                                                    <div className="profile-password">
                                                        <form onSubmit={handlePasswordChange}>
                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label">Current Password <span className="text-danger">*</span></label>
                                                                        <input 
                                                                            type="password" 
                                                                            className="form-control"
                                                                            value={passwordForm.currentPassword}
                                                                            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                                                            placeholder="Enter current password"
                                                                            required
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label">New Password <span className="text-danger">*</span></label>
                                                                        <input 
                                                                            type="password" 
                                                                            className="form-control"
                                                                            value={passwordForm.newPassword}
                                                                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                                                            placeholder="Enter new password"
                                                                            minLength="6"
                                                                            required
                                                                        />
                                                                        <small className="form-text text-muted">Minimum 6 characters</small>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label">Confirm New Password <span className="text-danger">*</span></label>
                                                                        <input 
                                                                            type="password" 
                                                                            className="form-control"
                                                                            value={passwordForm.confirmPassword}
                                                                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                                                            placeholder="Confirm new password"
                                                                            required
                                                                        />
                                                                        {passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                                                                            <small className="form-text text-danger">Passwords do not match</small>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <button type="submit" className="btn btn-primary btn-lg" disabled={updating || (passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword)}>
                                                                    {updating ? (
                                                                        <>
                                                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                                            Changing...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <SVGICON icon="lock" className="me-2" />
                                                                            Change Password
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </Tab.Pane>
                                            </Tab.Content>
                                        </Tab.Container>
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

export default Profile;