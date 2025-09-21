import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TaskService } from '../../services/TaskService';
import { UserService } from '../../services/UserService';
import { toast } from 'react-toastify';
import PageTitle from '../layouts/PageTitle';

const CreateTask = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInterns = async () => {
            try {
                const response = await UserService.getInternees();
                if (response.data.success && Array.isArray(response.data.data.users)) {
                    setInterns(response.data.data.users);
                } else {
                    toast.error(response.data.message || 'Failed to fetch interns.');
                    setInterns([]); 
                }
            } catch (error) {
                console.error("Error fetching interns:", error);
                toast.error(error.response?.data?.message || 'An error occurred while fetching interns.');
                setInterns([]);
            }
        };
        fetchInterns();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // --- Field Validation ---
        if (!title.trim() || !description.trim() || !assigneeId || !dueDate) {
            toast.error('Please fill out all required fields.');
            return;
        }

        // --- Past Date Validation ---
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight to compare dates only
        const selectedDate = new Date(dueDate);

        if (selectedDate < today) {
            toast.error('The due date cannot be in the past. Please select a valid date.');
            return;
        }

        setLoading(true);
        const taskData = { title, description, assigneeId, priority, dueDate };

        try {
            const response = await TaskService.createTask(taskData);
            if (response.data.success) {
                toast.success('Task created successfully!');
                navigate('/all-tasks');
            } else {
                toast.error(response.data.message || 'Failed to create task.');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error(error.response?.data?.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageTitle activeMenu="Create Task" motherMenu="Tasks" />
            <div className="container-fluid">
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Create a New Task</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="title">Title <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                <small className="form-text text-muted">Must be between 5 and 50 characters.</small>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="description">Description <span className="text-danger">*</span></label>
                                <textarea className="form-control" id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                                <small className="form-text text-muted">Must be at least 10 characters long.</small>
                            </div>
                            <div className="row">
                                <div className="col-md-6 form-group mb-3">
                                    <label htmlFor="assigneeId">Assign To <span className="text-danger">*</span></label>
                                    <select className="form-control" id="assigneeId" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} required>
                                        <option value="">Select an Intern</option>
                                        {interns.map(intern => (
                                            <option key={intern.id} value={intern.id}>{intern.firstName} {intern.lastName}</option>
                                        ))}
                                    </select>
                                    <small className="form-text text-muted">An intern must be assigned.</small>
                                </div>
                                <div className="col-md-6 form-group mb-3">
                                    <label htmlFor="priority">Priority</label>
                                    <select className="form-control" id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                    <small className="form-text text-muted">Set the priority level for the task.</small>
                                </div>
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="dueDate">Due Date <span className="text-danger">*</span></label>
                                <input type="date" className="form-control" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                                <small className="form-text text-muted">A future date must be selected.</small>
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
        </>
    );
};

export default CreateTask;
