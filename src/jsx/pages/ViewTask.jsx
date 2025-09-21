import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TaskService } from '../../services/TaskService';
import * as AuthService from '../../services/AuthService';
import { toast } from 'react-toastify';
import PageTitle from '../layouts/PageTitle';

const ViewTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [submissionNotes, setSubmissionNotes] = useState('');
    const [submissionFile, setSubmissionFile] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const fetchTaskAndUser = useCallback(async () => {
        setLoading(true);
        try {
            // Correctly get user details
            const userDetails = AuthService.getUserDetails();
            if (userDetails) {
                // Set the user object directly
                setCurrentUser(userDetails);
            } else {
                toast.error("You must be logged in to view this page.");
                navigate('/login');
                return;
            }

            const response = await TaskService.getTaskById(id);
            if (response.data.success) {
                const fetchedTask = response.data.data;
                setTask(fetchedTask);
                setFeedback(fetchedTask.feedback || '');
            } else {
                toast.error(response.data.message || 'Failed to load task');
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error(error.response?.data?.message || 'An error occurred while fetching the task.');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchTaskAndUser();
    }, [fetchTaskAndUser]);

    const handleAccept = async () => {
        try {
            await TaskService.acceptTask(id, { feedback });
            toast.success('Task accepted successfully');
            fetchTaskAndUser(); // Re-fetch to get the latest state
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
            toast.success('Task rejected successfully');
            fetchTaskAndUser(); // Re-fetch to get the latest state
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
            toast.success('Task submitted for review');
            fetchTaskAndUser(); // Re-fetch to get the latest state
        } catch (error) {
            console.error('Error submitting task:', error);
            toast.error(error.response?.data?.message || 'Failed to submit task');
        }
    };

    if (loading) return <p>Loading task...</p>;
    if (!task) return <p>Task not found or you are not authorized to view it.</p>;
    
    // Correctly check if the current user is the assignee using string comparison
    const isAssignee = currentUser && task && String(currentUser.id) === String(task.assigneeId);
    const canSubmit = isAssignee && ['assigned', 'rejected'].includes(task.status);
    const canReview = currentUser && ['admin', 'team_lead'].includes(currentUser.role) && task.status === 'submitted';
    
    const backLink = currentUser?.role === 'internee' ? '/my-tasks' : '/all-tasks';

    const getStatusBadge = (status) => {
        const statuses = { assigned: 'badge-primary', submitted: 'badge-warning', accepted: 'badge-success', rejected: 'badge-danger' };
        return statuses[status] || 'badge-secondary';
    };

    return (
        <>
            <PageTitle activeMenu="Task Details" motherMenu="Tasks" />
            <div className="container-fluid">
                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                        <h4 className="card-title">{task.title}</h4>
                        <Link to={backLink} className="btn btn-secondary">Back to Tasks</Link>
                    </div>
                    <div className="card-body">
                        <div className="row mb-4">
                            <div className="col-md-3"><strong>Status:</strong> <span className={`badge ${getStatusBadge(task.status)}`}>{task.status}</span></div>
                            <div className="col-md-3"><strong>Priority:</strong> {task.priority}</div>
                            <div className="col-md-3"><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</div>
                            <div className="col-md-3"><strong>Assignee:</strong> {task.assignee?.firstName} {task.assignee?.lastName}</div>
                        </div>
                        <p><strong>Description:</strong> {task.description}</p>

                        {task.submissionFile && (
                            <div className="mt-4">
                                <h5>Submission</h5>
                                <p><strong>Notes:</strong> {task.submissionNotes}</p>
                                <a href={`http://localhost:5000/uploads/tasks/${task.submissionFile}`} target="_blank" rel="noopener noreferrer">Download Submitted File</a>
                            </div>
                        )}

                        {task.feedback && (
                            <div className="mt-4">
                                <h5>Feedback</h5>
                                <p>{task.feedback}</p>
                            </div>
                        )}

                        {canSubmit && (
                            <form onSubmit={handleSubmit} className="mt-4 pt-4 border-top">
                                <h5>Submit Your Work</h5>
                                <div className="form-group mb-3">
                                    <textarea className="form-control" rows="3" onChange={(e) => setSubmissionNotes(e.target.value)} placeholder="Submission notes..."></textarea>
                                </div>
                                <div className="form-group mb-3">
                                    <input type="file" className="form-control" onChange={(e) => setSubmissionFile(e.target.files[0])} />
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        )}

                        {canReview && (
                            <div className="mt-4 pt-4 border-top">
                                <h5>Review Submission</h5>
                                <textarea className="form-control mb-2" rows="3" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Provide feedback..."></textarea>
                                <button onClick={handleAccept} className="btn btn-success me-2">Accept</button>
                                <button onClick={handleReject} className="btn btn-danger">Reject</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewTask;
