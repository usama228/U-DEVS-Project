import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../layouts/PageTitle';
import { UserService } from '../../services/UserService';
import { toast } from 'react-toastify';

const CreateUser = () => {
    const navigate = useNavigate();
    const [teamLeads, setTeamLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        idCardNumber: '',
        role: 'internee',
        teamLeadId: '',
        profilePicture: null,
        idCardFrontPic: null,
        idCardBackPic: null
    });

    useEffect(() => {
        fetchTeamLeads();
    }, []);

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

    const validateForm = () => {
        const newErrors = {};

        // First Name validation
        if (!formData.firstName || !formData.firstName.trim()) {
            newErrors.firstName = 'First Name is required';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'First Name must be at least 2 characters';
        } else if (formData.firstName.trim().length > 50) {
            newErrors.firstName = 'First Name must be less than 50 characters';
        }

        // Last Name validation
        if (!formData.lastName || !formData.lastName.trim()) {
            newErrors.lastName = 'Last Name is required';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Last Name must be at least 2 characters';
        } else if (formData.lastName.trim().length > 50) {
            newErrors.lastName = 'Last Name must be less than 50 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = 'Please enter a valid email address';
        } else if (formData.email.trim().length > 100) {
            newErrors.email = 'Email must be less than 100 characters';
        }

        // Password validation
        if (!formData.password || formData.password.trim() === '') {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (formData.password.length > 100) {
            newErrors.password = 'Password must be less than 100 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        // Phone validation - Pakistani phone number format
        if (!formData.phone || !formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else {
            const cleanPhone = formData.phone.replace(/[\s-]/g, '').trim();
            const phoneRegex = /^((\+92)|(0092))\d{10}$|^0\d{10}$/;
            if (!phoneRegex.test(cleanPhone)) {
                newErrors.phone = 'Please enter a valid Pakistani phone number (e.g., 03001234567 or +923001234567).';
            }
        }

        // ID Card Number validation - Pakistani CNIC format
        const nicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
        if (!formData.idCardNumber || !formData.idCardNumber.trim()) {
            newErrors.idCardNumber = 'ID Card Number is required';
        } else if (!nicRegex.test(formData.idCardNumber.trim())) {
            newErrors.idCardNumber = 'Please enter a valid CNIC format (e.g., 12345-1234567-1)';
        }

        // Role validation
        if (!formData.role || formData.role.trim() === '') {
            newErrors.role = 'Role is required';
        } else if (!['admin', 'team_lead', 'employee', 'internee'].includes(formData.role)) {
            newErrors.role = 'Please select a valid role';
        }

        // Team Lead validation for internees
        if (formData.role === 'internee') {
            if (!formData.teamLeadId || formData.teamLeadId.trim() === '') {
                newErrors.teamLeadId = 'Team Lead is required for internees';
            }
        }

        // ID Card Front Picture validation
        if (!formData.idCardFrontPic) {
            newErrors.idCardFrontPic = 'ID Card Front Picture is required';
        } else {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(formData.idCardFrontPic.type)) {
                newErrors.idCardFrontPic = 'Please upload a valid image file (JPEG, PNG, or GIF)';
            } else if (formData.idCardFrontPic.size > 5 * 1024 * 1024) { // 5MB limit
                newErrors.idCardFrontPic = 'Image size must be less than 5MB';
            }
        }

        // ID Card Back Picture validation
        if (!formData.idCardBackPic) {
            newErrors.idCardBackPic = 'ID Card Back Picture is required';
        } else {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(formData.idCardBackPic.type)) {
                newErrors.idCardBackPic = 'Please upload a valid image file (JPEG, PNG, or GIF)';
            } else if (formData.idCardBackPic.size > 5 * 1024 * 1024) { // 5MB limit
                newErrors.idCardBackPic = 'Image size must be less than 5MB';
            }
        }

        // Profile Picture validation (optional but if provided, validate)
        if (formData.profilePicture) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(formData.profilePicture.type)) {
                newErrors.profilePicture = 'Please upload a valid image file (JPEG, PNG, or GIF)';
            } else if (formData.profilePicture.size > 5 * 1024 * 1024) { // 5MB limit
                newErrors.profilePicture = 'Image size must be less than 5MB';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        let formattedValue = value;
        
        if (name === 'idCardNumber') {
            const digits = value.replace(/\D/g, '');
            if (digits.length <= 5) {
                formattedValue = digits;
            } else if (digits.length <= 12) {
                formattedValue = `${digits.substring(0, 5)}-${digits.substring(5)}`;
            } else {
                formattedValue = `${digits.substring(0, 5)}-${digits.substring(5, 12)}-${digits.substring(12, 13)}`;
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));
        
        // Clear error for the field when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            let error = '';
            
            if (!allowedTypes.includes(file.type)) {
                error = 'Please upload a valid image file (JPEG, PNG, or GIF)';
            } else if (file.size > 5 * 1024 * 1024) { // 5MB limit
                error = 'Image size must be less than 5MB';
            }
            
            if (error) {
                setErrors(prev => ({
                    ...prev,
                    [name]: error
                }));
                e.target.value = '';
                return;
            }
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: file
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);

        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    submitData.append(key, formData[key]);
                }
            });

            const response = await UserService.createUser(submitData);
            if (response.data.success) {
                toast.success('User created successfully');
                navigate('/users');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error(error.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageTitle activeMenu="Create User" motherMenu="User Management" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Create New User</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="form-label">
                                                    First Name <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter first name"
                                                />
                                                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="form-label">
                                                    Last Name <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter last name"
                                                />
                                                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="form-label">
                                                    Email <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter email address"
                                                />
                                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group mb-3 position-relative">
                                                <label className="form-label">
                                                    Password <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter password"
                                                />
                                                <span className="position-absolute end-0 translate-middle-y"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{
                                                    cursor: "pointer",
                                                    paddingRight: "0.75rem",
                                                    transform: "translateY(-50%)",
                                                    paddingBottom: "2.4rem"
                                                    }}>
                                                    <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                                </span>
                                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="form-label">
                                                    Phone Number <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="03001234567 or +923001234567"
                                                    maxLength="15"
                                                />
                                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                                <small className="form-text text-muted">Enter a valid Pakistani phone number.</small>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="form-label">
                                                    ID Card Number (CNIC) <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="idCardNumber"
                                                    className={`form-control ${errors.idCardNumber ? 'is-invalid' : ''}`}
                                                    value={formData.idCardNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="12345-1234567-1"
                                                    maxLength="15"
                                                />
                                                {errors.idCardNumber && <div className="invalid-feedback">{errors.idCardNumber}</div>}
                                                <small className="form-text text-muted">Enter CNIC in format: 12345-1234567-1</small>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="form-label">
                                                    Role <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    name="role"
                                                    className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                                                    value={formData.role}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Select Role</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="team_lead">Team Lead</option>
                                                    <option value="employee">Employee</option>
                                                    <option value="internee">Internee</option>
                                                </select>
                                                {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                                            </div>
                                        </div>

                                        {formData.role === 'internee' && (
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label className="form-label">
                                                        Team Lead <span className="text-danger">*</span>
                                                    </label>
                                                    <select
                                                        name="teamLeadId"
                                                        className={`form-control ${errors.teamLeadId ? 'is-invalid' : ''}`}
                                                        value={formData.teamLeadId}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="">Select Team Lead</option>
                                                        {teamLeads.map((lead) => (
                                                            <option key={lead.id} value={lead.id}>
                                                                {lead.firstName} {lead.lastName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.teamLeadId && <div className="invalid-feedback">{errors.teamLeadId}</div>}
                                                </div>
                                            </div>
                                        )}

                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label className="form-label">Profile Picture</label>
                                                <input
                                                    type="file"
                                                    name="profilePicture"
                                                    className={`form-control ${errors.profilePicture ? 'is-invalid' : ''}`}
                                                    accept="image/jpeg,image/jpg,image/png,image/gif"
                                                    onChange={handleFileChange}
                                                />
                                                {errors.profilePicture && <div className="invalid-feedback">{errors.profilePicture}</div>}
                                                <small className="form-text text-muted">
                                                    Optional: Upload profile picture (Max 5MB, JPEG/PNG/GIF)
                                                </small>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label className="form-label">
                                                    ID Card Front Picture <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    name="idCardFrontPic"
                                                    className={`form-control ${errors.idCardFrontPic ? 'is-invalid' : ''}`}
                                                    accept="image/jpeg,image/jpg,image/png,image/gif"
                                                    onChange={handleFileChange}
                                                />
                                                {errors.idCardFrontPic && <div className="invalid-feedback">{errors.idCardFrontPic}</div>}
                                                <small className="form-text text-muted">
                                                    Required: Upload front of ID card (Max 5MB, JPEG/PNG/GIF)
                                                </small>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label className="form-label">
                                                    ID Card Back Picture <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    name="idCardBackPic"
                                                    className={`form-control ${errors.idCardBackPic ? 'is-invalid' : ''}`}
                                                    accept="image/jpeg,image/jpg,image/png,image/gif"
                                                    onChange={handleFileChange}
                                                />
                                                {errors.idCardBackPic && <div className="invalid-feedback">{errors.idCardBackPic}</div>}
                                                <small className="form-text text-muted">
                                                    Required: Upload back of ID card (Max 5MB, JPEG/PNG/GIF)
                                                </small>
                                            </div>
                                        </div>

                                        <div className="col-md-12 d-flex mt-3">
                                            <button
                                                type="submit"
                                                className="btn btn-primary me-2"
                                                disabled={loading}
                                            >
                                                {loading ? 'Creating...' : 'Create User'}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => navigate('/users')}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateUser;