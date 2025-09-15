import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TaskService } from '../../services/TaskService';
import { toast } from 'react-toastify';

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await TaskService.getMyTasks();
                if (response.data.success) {
                    setTasks(response.data.data.tasks);
                } else {
                    toast.error(response.data.message || 'Failed to fetch tasks');
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
                toast.error(error.response?.data?.message || 'An error occurred while fetching tasks');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">My Tasks</h4>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <p>Loading tasks...</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Due Date</th>
                                                <th>Status</th>
                                                <th>Feedback</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tasks.map(task => (
                                                <tr key={task.id}>
                                                    <td>{task.title}</td>
                                                    <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`badge ${task.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                    <td>{task.feedback || '-'}</td>
                                                    <td>
                                                        <Link to={`/task/${task.id}`} className="btn btn-sm btn-info">View</Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTasks;
