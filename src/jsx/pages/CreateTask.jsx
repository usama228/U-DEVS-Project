import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import PageTitle from '../layouts/PageTitle';
import { TaskService } from '../../services/TaskService';
import { UserService } from '../../services/UserService';
import { toast } from 'react-toastify';
import { getUserDetails } from '../../services/AuthService';
import { USER_ROLES } from '../../utils/rolePermissions';

const CreateTask = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        assigneeId: ''
    });
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(false);
    const currentUser = getUserDetails();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let response;
                if (currentUser.role === USER_ROLES.TEAM_LEAD) {
                    response = await UserService.getInternees(currentUser.id);
                } else if (currentUser.role === USER_ROLES.ADMIN) {
                    response = await UserService.getInternees();
                } else {
                    toast.error("You are not authorized to create tasks.");
                    return;
                }
                
                if(response.data.success) {
                    const internUsers = response.data.data.users || []; // Ensure it's an array
                    setInterns(internUsers);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error(error.response?.data?.message || "Failed to load users");
            }
        };
        fetchUsers();
    }, [currentUser.id, currentUser.role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await TaskService.createTask(formData);
            if (response.data.success) {
                toast.success('Task created successfully!');
                navigate('/all-tasks');
            } else {
                toast.error(response.data.message || 'Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error(error.response?.data?.message || 'An error occurred while creating the task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container-fluid">
                <PageTitle activeMenu="Create Task" motherMenu="Task Management" />
            </div>
            <div className="dashboard-wrapper">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Create New Task</h4>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="title" className="form-label">Title <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleChange} required minLength="3" maxLength="100" />
                                                    <small className="form-text text-muted">Required, 3-100 characters</small>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="dueDate" className="form-label">Due Date <span className="text-danger">*</span></label>
                                                    <input type="date" className="form-control" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
                                                    <small className="form-text text-muted">Required</small>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-3">
                                                    <label htmlFor="description" className="form-label">Description <span className="text-danger">*</span></label>
                                                    <textarea className="form-control" id="description" name="description" rows="3" value={formData.description} onChange={handleChange} required minLength="10" maxLength="1000"></textarea>
                                                    <small className="form-text text-muted">Required, 10-1000 characters</small>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="assigneeId" className="form-label">Assign To <span className="text-danger">*</span></label>
                                                    <select className="form-control" id="assigneeId" name="assigneeId" value={formData.assigneeId} onChange={handleChange} required>
                                                        <option value="">Select Intern</option>
                                                        {interns.map(user => (
                                                            <option key={user.id} value={user.id}>{user.firstName} {user.lastName} ({user.email})</option>
                                                        ))}
                                                    </select>
                                                    <small className="form-text text-muted">Required</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <Link to="/all-tasks" className="btn btn-secondary me-2">Cancel</Link>
                                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                                {loading ? 'Creating...' : 'Create Task'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateTask;
