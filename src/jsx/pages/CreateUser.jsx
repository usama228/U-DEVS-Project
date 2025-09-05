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
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First Name is required';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'First Name must be at least 2 characters';
        }

        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last Name is required';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Last Name must be at least 2 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Phone validation - Pakistani phone number format
        const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid Pakistani phone number (e.g., 03001234567 or +923001234567)';
        }

        // ID Card Number validation - Pakistani CNIC format
        const nicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
        if (!formData.idCardNumber.trim()) {
            newErrors.idCardNumber = 'ID Card Number is required';
        } else if (!nicRegex.test(formData.idCardNumber)) {
            newErrors.idCardNumber = 'Please enter a valid CNIC format (e.g., 12345-1234567-1)';
        }

        // Role validation
        if (!formData.role) {
            newErrors.role = 'Role is required';
        }

        // Team Lead validation for internees
        if (formData.role === 'internee' && !formData.teamLeadId) {
            newErrors.teamLeadId = 'Team Lead is required for internees';
        }

        // ID Card Front Picture validation
        if (!formData.idCardFrontPic) {
            newErrors.idCardFrontPic = 'ID Card Front Picture is required';
        }

        // ID Card Back Picture validation
        if (!formData.idCardBackPic) {
            newErrors.idCardBackPic = 'ID Card Back Picture is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'phone':
                const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
                if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
                    error = 'Please enter a valid Pakistani phone number (e.g., 03001234567 or +923001234567)';
                }
                break;
            case 'idCardNumber':
                const nicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
                if (value && !nicRegex.test(value)) {
                    error = 'Please enter a valid CNIC format (e.g., 12345-1234567-1)';
                }
                break;
        }

        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Format phone number as user types
        let formattedValue = value;
        if (name === 'phone') {
            // Remove all non-digits
            const digits = value.replace(/\D/g, '');
            // Format as Pakistani phone number
            if (digits.length > 0) {
                if (digits.startsWith('92')) {
                    formattedValue = '+' + digits.substring(0, 2) + ' ' + digits.substring(2, 5) + ' ' + digits.substring(5, 8) + ' ' + digits.substring(8, 11);
                } else if (digits.startsWith('0')) {
                    formattedValue = digits.substring(0, 4) + ' ' + digits.substring(4, 7) + ' ' + digits.substring(7, 11);
                } else {
                    formattedValue = digits.substring(0, 4) + ' ' + digits.substring(4, 7) + ' ' + digits.substring(7, 11);
                }
            }
        }
        
        // Format CNIC as user types
        if (name === 'idCardNumber') {
            const digits = value.replace(/\D/g, '');
            if (digits.length <= 5) {
                formattedValue = digits;
            } else if (digits.length <= 12) {
                formattedValue = digits.substring(0, 5) + '-' + digits.substring(5);
            } else {
                formattedValue = digits.substring(0, 5) + '-' + digits.substring(5, 12) + '-' + digits.substring(12, 13);
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));
        
        // Real-time validation
        const error = validateField(name, formattedValue);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files[0]
        }));
        
        // Clear error when file is selected
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
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="form-label">First Name <span className="text-danger">*</span></label>
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
                                                <label className="form-label">Last Name <span className="text-danger">*</span></label>
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
                                                <label className="form-label">Email <span className="text-danger">*</span></label>
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
                                            <div className="form-group mb-3">
                                                <label className="form-label">Password <span className="text-danger">*</span></label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter password"
                                                />
                                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="0300 123 4567 or +92 300 123 4567"
                                                    maxLength="17"
                                                />
                                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                                <small className="form-text text-muted">Enter Pakistani phone number</small>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="form-label">ID Card Number (CNIC) <span className="text-danger">*</span></label>
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
                                                <label className="form-label">Role <span className="text-danger">*</span></label>
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
                                                    <label className="form-label">Team Lead <span className="text-danger">*</span></label>
                                                    <select
                                                        name="teamLeadId"
                                                        className={`form-control ${errors.teamLeadId ? 'is-invalid' : ''}`}
                                                        value={formData.teamLeadId}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="">Select Team Lead</option>
                                                        {teamLeads.map(lead => (
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
                                                    className="form-control"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                <small className="form-text text-muted">Optional: Upload profile picture</small>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label className="form-label">ID Card Front Picture <span className="text-danger">*</span></label>
                                                <input
                                                    type="file"
                                                    name="idCardFrontPic"
                                                    className={`form-control ${errors.idCardFrontPic ? 'is-invalid' : ''}`}
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                {errors.idCardFrontPic && <div className="invalid-feedback">{errors.idCardFrontPic}</div>}
                                                <small className="form-text text-muted">Required: Upload front of ID card</small>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group mb-3">
                                                <label className="form-label">ID Card Back Picture <span className="text-danger">*</span></label>
                                                <input
                                                    type="file"
                                                    name="idCardBackPic"
                                                    className={`form-control ${errors.idCardBackPic ? 'is-invalid' : ''}`}
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                {errors.idCardBackPic && <div className="invalid-feedback">{errors.idCardBackPic}</div>}
                                                <small className="form-text text-muted">Required: Upload back of ID card</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
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