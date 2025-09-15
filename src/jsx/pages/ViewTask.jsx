import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TaskService } from '../../services/TaskService';
import * as AuthService from '../../services/AuthService';
import { toast } from 'react-toastify';

const ViewTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [submissionNotes, setSubmissionNotes] = useState('');
    const [submissionFile, setSubmissionFile] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchTaskAndUser = async () => {
            setLoading(true);
            try {
                // Correctly check for the user object itself
                const userDetails = AuthService.getUserDetails();
                if (userDetails) {
                    setCurrentUser(userDetails);
                } else {
                    toast.error("You must be logged in to view this page.");
                    navigate('/login');
                    return;
                }

                const response = await TaskService.getTaskById(id);
                if (response.data.success) {
                    const fetchedTask = response.data.data.task;
                    setTask(fetchedTask);
                    if (fetchedTask.feedback) {
                        setFeedback(fetchedTask.feedback);
                    }
                } else {
                    toast.error(response.data.message || 'Failed to load task');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error(error.response?.data?.message || 'An error occurred while fetching the task.');
            } finally {
                setLoading(false);
            }
        };

        fetchTaskAndUser();
    }, [id, navigate]);

    const handleAccept = async () => {
        try {
            await TaskService.acceptTask(id, { feedback });
            setTask({ ...task, status: 'completed', feedback });
            toast.success('Task accepted successfully');
        } catch (error) {
            console.error('Error accepting task:', error);
            toast.error(error.response?.data?.message || 'Failed to accept task');
        }
    };

    const handleReject = async () => {
        if (!feedback) {
            toast.error("Feedback is required when rejecting a task.");
            return;
        }
        try {
            await TaskService.rejectTask(id, { feedback });
            setTask({ ...task, status: 'rejected', feedback });
            toast.success('Task rejected successfully');
        } catch (error) {
            console.error('Error rejecting task:', error);
            toast.error(error.response?.data?.message || 'Failed to reject task');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('submissionNotes', submissionNotes);
        if (submissionFile) {
            formData.append('submissionFile', submissionFile);
        }

        try {
            await TaskService.submitTask(id, formData);
            setTask({ ...task, status: 'submitted' });
            toast.success('Task submitted for review');
        } catch (error) {
            console.error('Error submitting task:', error);
            toast.error(error.response?.data?.message || 'Failed to submit task');
        }
    };
    
    const handleBack = () => {
        if (currentUser?.role === 'intern') {
            navigate('/my-tasks');
        } else {
            navigate(-1);
        }
    };

    if (loading) {
        return <p>Loading task...</p>;
    }

    if (!task) {
        return <p>Task not found or you are not authorized to view it.</p>;
    }
    
    const isAssignee = currentUser && String(currentUser.id) === String(task.assigneeId);
    const canSubmit = isAssignee && (task.status === 'assigned' || task.status === 'rejected');
    const canReview = currentUser && (currentUser.role === 'admin' || currentUser.role === 'team_lead') && task.status === 'submitted';

    const submissionFileUrl = task.submissionFile ? `http://localhost:5000/uploads/tasks/${task.submissionFile}` : null;

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Task Details</h4>
                            <button onClick={handleBack} className="btn btn-secondary">Back</button>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>Title:</strong> {task.title}</p>
                                    <p><strong>Status:</strong> <span className={`badge ${task.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{task.status}</span></p>
                                    <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Assigned To:</strong> {task.assignee?.firstName} {task.assignee?.lastName}</p>
                                    <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</p>
                                    <p><strong>Updated At:</strong> {new Date(task.updatedAt).toLocaleString()}</p>
                                </div>
                                <div className="col-md-12 mt-3">
                                    <p><strong>Description:</strong></p>
                                    <p>{task.description}</p>
                                </div>

                                {submissionFileUrl && (
                                     <div className="col-md-12 mt-3">
                                        <p><strong>Submission File:</strong></p>
                                        <a href={submissionFileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-info">Download Submission</a>
                                    </div>
                                )}

                                {task.submissionNotes && (
                                     <div className="col-md-12 mt-3">
                                        <p><strong>Submission Notes:</strong></p>
                                        <p>{task.submissionNotes}</p>
                                    </div>
                                )}

                                {task.feedback && (
                                     <div className="col-md-12 mt-4 pt-4 border-top">
                                        <p><strong>Feedback:</strong></p>
                                        <p>{task.feedback}</p>
                                    </div>
                                )}
                                
                                {canSubmit && (
                                    <div className="col-md-12 mt-4 pt-4 border-top">
                                        <h4>Submit Your Work</h4>
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group mb-3">
                                                <label htmlFor="submissionNotes">Submission Notes</label>
                                                <textarea
                                                    id="submissionNotes"
                                                    className="form-control"
                                                    rows="3"
                                                    value={submissionNotes}
                                                    onChange={(e) => setSubmissionNotes(e.target.value)}
                                                    placeholder="Add any notes for your submission..."
                                                ></textarea>
                                            </div>
                                            <div className="form-group mb-3">
                                                <label htmlFor="submissionFile">Submission File</label>
                                                <input 
                                                    type="file" 
                                                    className="form-control"
                                                    id="submissionFile"
                                                    onChange={(e) => setSubmissionFile(e.target.files[0])}
                                                />
                                                <small className="form-text text-muted">Max file size: 5MB</small>
                                            </div>
                                            <button type="submit" className="btn btn-primary">Submit Task</button>
                                        </form>
                                    </div>
                                )}
                                
                                {canReview && (
                                    <div className="col-md-12 mt-4 pt-4 border-top">
                                        <h4>Review Task</h4>
                                        <div className="form-group mb-3">
                                            <label htmlFor="feedback">Provide or Update Feedback</label>
                                            <textarea 
                                                className="form-control"
                                                id="feedback"
                                                rows="3"
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                placeholder="Provide feedback for the submission..."
                                            ></textarea>
                                        </div>
                                        <button onClick={handleAccept} className="btn btn-success me-2">Accept</button>
                                        <button onClick={handleReject} className="btn btn-danger">Reject</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTask;
