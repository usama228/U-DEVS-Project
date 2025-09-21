import React, { useState, useEffect } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import { updateProfile, changePassword, getProfile } from '../../services/AuthService';
import { toast } from 'react-toastify';
import { IMAGE_URL } from '../../config';
import ImageModal from '../../components/ImageModal';
import { IMAGES } from '../constant/theme';

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        idCardNumber: '',
        profilePicture: null,
        idCardFrontPic: null,
        idCardBackPic: null
    });
    const [initialProfileForm, setInitialProfileForm] = useState({});
    const [errors, setErrors] = useState({});
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [updating, setUpdating] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    useEffect(() => {
        fetchUserDetails();
        document.body.classList.add('profile-page');
        return () => {
            document.body.classList.remove('profile-page');
        };
    }, []);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const response = await getProfile();
            if (response.data.success) {
                const user = response.data.data.user;
                setUserDetails(user);
                const initialData = {
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    phone: user.phone || '',
                    idCardNumber: user.idCardNumber || '',
                };
                setProfileForm({ ...initialData, profilePicture: null, idCardFrontPic: null, idCardBackPic: null });
                setInitialProfileForm(initialData);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            toast.error('Failed to load user details');
        } finally {
            setLoading(false);
        }
    };

    const validateProfileForm = () => {
        const newErrors = {};
        if (!profileForm.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!profileForm.lastName.trim()) newErrors.lastName = 'Last name is required';

        if (profileForm.phone && profileForm.phone.trim()) {
            const cleanPhone = profileForm.phone.replace(/[\s-]/g, '').trim();
            const phoneRegex = /^((\+92)|(0092))\d{10}$|^0\d{10}$/;
            if (!phoneRegex.test(cleanPhone)) {
                newErrors.phone = 'Please enter a valid Pakistani phone number (e.g., 03001234567).';
            }
        }

        if (profileForm.idCardNumber && profileForm.idCardNumber.trim()) {
            const nicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
            if (!nicRegex.test(profileForm.idCardNumber.trim())) {
                newErrors.idCardNumber = 'Please enter a valid CNIC format (e.g., 12345-1234567-1).';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!validateProfileForm()) {
            toast.error('Please fix the errors in the form.');
            return;
        }

        setUpdating(true);
        try {
            const response = await updateProfile(profileForm); // Simplified: Send the whole form
            if (response.data.success) {
                toast.success('Profile updated successfully');
                await fetchUserDetails();
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
        if (!passwordForm.currentPassword) {
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setProfileForm(prev => ({ ...prev, [name]: files[0] }));
    };

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
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
                                <div className="profile-tab">
                                    <div className="custom-tab-1">
                                        <Tab.Container defaultActiveKey="about">
                                            <Nav as="ul" className="nav nav-tabs">
                                                <Nav.Item as="li" className="nav-item"><Nav.Link eventKey="about">About Me</Nav.Link></Nav.Item>
                                                <Nav.Item as="li" className="nav-item"><Nav.Link eventKey="timeline">Edit Profile</Nav.Link></Nav.Item>
                                                <Nav.Item as="li" className="nav-item"><Nav.Link eventKey="password">Change Password</Nav.Link></Nav.Item>
                                            </Nav>
                                            <Tab.Content className="pt-3">
                                                <Tab.Pane eventKey="about">
                                                    <div className="profile-about-me">
                                                        <div className="pt-3">
                                                            <div className="row mb-2"><div className="col-3"><h5 className="f-w-500">Full Name <span className="pull-right">:</span></h5></div><div className="col-9"><span>{userDetails?.firstName} {userDetails?.lastName}</span></div></div>
                                                            <div className="row mb-2"><div className="col-3"><h5 className="f-w-500">Email <span className="pull-right">:</span></h5></div><div className="col-9"><span>{userDetails?.email}</span></div></div>
                                                            <div className="row mb-2"><div className="col-3"><h5 className="f-w-500">Phone <span className="pull-right">:</span></h5></div><div className="col-9"><span>{userDetails?.phone}</span></div></div>
                                                            <div className="row mb-2"><div className="col-3"><h5 className="f-w-500">ID Card <span className="pull-right">:</span></h5></div><div className="col-9"><span>{userDetails?.idCardNumber}</span></div></div>
                                                            <div className="row mb-2"><div className="col-3"><h5 className="f-w-500">Role <span className="pull-right">:</span></h5></div><div className="col-9"><span>{userDetails?.role?.replace('_', ' ').toUpperCase()}</span></div></div>
                                                            {userDetails?.teamLead && (<div className="row mb-2"><div className="col-3"><h5 className="f-w-500">Team Lead <span className="pull-right">:</span></h5></div><div className="col-9"><span>{userDetails.teamLead.firstName} {userDetails.teamLead.lastName}</span></div></div>)}
                                                            <div className="row mb-2"><div className="col-3"><h5 className="f-w-500">Status <span className="pull-right">:</span></h5></div><div className="col-9"><span className={`badge ${userDetails?.isActive ? 'bg-success text-white' : 'bg-secondary text-white'} px-3 py-2`}>{userDetails?.isActive ? 'Active' : 'Inactive'}</span></div></div>
                                                            <div className="row mb-2"><div className="col-3"><h5 className="f-w-500">Joined <span className="pull-right">:</span></h5></div><div className="col-9"><span>{new Date(userDetails?.createdAt).toLocaleDateString()}</span></div></div>
                                                        </div>
                                                    </div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="timeline">
                                                    <div className="profile-edit">
                                                        <form onSubmit={handleProfileUpdate} noValidate>
                                                            <div className="row">
                                                                <div className="col-lg-6 col-md-6"><div className="form-group mb-3">
                                                                    <label className="form-label">First Name <span className="text-danger">*</span></label>
                                                                    <input type="text" name="firstName" className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} value={profileForm.firstName} onChange={handleInputChange} required />
                                                                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                                                                </div></div>
                                                                <div className="col-lg-6 col-md-6"><div className="form-group mb-3">
                                                                    <label className="form-label">Last Name <span className="text-danger">*</span></label>
                                                                    <input type="text" name="lastName" className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} value={profileForm.lastName} onChange={handleInputChange} required />
                                                                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                                                                </div></div>
                                                                <div className="col-lg-6 col-md-6"><div className="form-group mb-3">
                                                                    <label className="form-label">Phone Number</label>
                                                                    <input type="tel" name="phone" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={profileForm.phone} onChange={handleInputChange} placeholder="03001234567" />
                                                                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                                                </div></div>
                                                                <div className="col-lg-6 col-md-6"><div className="form-group mb-3">
                                                                    <label className="form-label">ID Card Number (CNIC)</label>
                                                                    <input type="text" name="idCardNumber" className={`form-control ${errors.idCardNumber ? 'is-invalid' : ''}`} value={profileForm.idCardNumber} onChange={handleInputChange} placeholder="12345-1234567-1" maxLength="15" />
                                                                    {errors.idCardNumber && <div className="invalid-feedback">{errors.idCardNumber}</div>}
                                                                </div></div>
                                                                <div className="col-lg-6 col-md-6"><div className="form-group mb-3">
                                                                    <label className="form-label">Profile Picture</label>
                                                                    <input type="file" name="profilePicture" className="form-control" onChange={handleFileChange} accept="image/jpeg,image/jpg,image/png,image/gif"/>
                                                                </div></div>
                                                                <div className="col-lg-6 col-md-6"><div className="form-group mb-3">
                                                                    <label className="form-label">ID Card Front</label>
                                                                    <input type="file" name="idCardFrontPic" className="form-control" onChange={handleFileChange} accept="image/jpeg,image/jpg,image/png"/>
                                                                </div></div>
                                                                <div className="col-lg-6 col-md-6"><div className="form-group mb-3">
                                                                    <label className="form-label">ID Card Back</label>
                                                                    <input type="file" name="idCardBackPic" className="form-control" onChange={handleFileChange} accept="image/jpeg,image/jpg,image/png"/>
                                                                </div></div>
                                                            </div>
                                                            <div className="col-12 mt-3">
                                                                <button type="submit" className="btn btn-primary btn-lg" disabled={updating}>
                                                                    {updating ? (<><span className="spinner-border spinner-border-sm me-2" role="status"></span>Updating...</>) : 'Update Profile'}
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
                                                                    <div className="form-group mb-3 position-relative">
                                                                        <label className="form-label">Current Password <span className="text-danger">*</span></label>
                                                                        <input type={showPassword ? "text" : "password"} name="currentPassword" className="form-control" value={passwordForm.currentPassword} onChange={handlePasswordInputChange} required />
                                                                        <span className="position-absolute end-0 translate-middle-y"
                                                                            onClick={() => setShowPassword(!showPassword)}
                                                                            style={{
                                                                                cursor: "pointer",
                                                                                paddingRight: "0.75rem",
                                                                                transform: "translateY(-50%)",
                                                                                paddingBottom: "2.5rem"
                                                                            }}>
                                                                            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6">
                                                                    <div className="form-group mb-3 position-relative">
                                                                        <label className="form-label">New Password <span className="text-danger">*</span></label>
                                                                        <input type={showNewPassword ? "text" : "password"} name="newPassword" className="form-control" value={passwordForm.newPassword} onChange={handlePasswordInputChange} required minLength="6" />
                                                                        <span className="position-absolute end-0 translate-middle-y"
                                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                                            style={{
                                                                                cursor: "pointer",
                                                                                paddingRight: "0.75rem",
                                                                                transform: "translateY(-50%)",
                                                                                paddingBottom: "2.5rem"
                                                                            }}>
                                                                            <i className={`fa ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6">
                                                                    <div className="form-group mb-3 position-relative">
                                                                        <label className="form-label">Confirm New Password <span className="text-danger">*</span></label>
                                                                        <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" className="form-control" value={passwordForm.confirmPassword} onChange={handlePasswordInputChange} required />
                                                                        <span className="position-absolute end-0 translate-middle-y"
                                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                            style={{
                                                                                cursor: "pointer",
                                                                                paddingRight: "0.75rem",
                                                                                transform: "translateY(-50%)",
                                                                                paddingBottom: "2.5rem"
                                                                            }}>
                                                                            <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                                                        </span>
                                                                        {passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                                                                            <small className="text-danger">Passwords do not match</small>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <button type="submit" className="btn btn-primary btn-lg" disabled={updating || (passwordForm.newPassword && passwordForm.newPassword !== passwordForm.confirmPassword)}>
                                                                    {updating ? (<><span className="spinner-border spinner-border-sm me-2" role="status"></span>Changing...</>) : 'Change Password'}
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
