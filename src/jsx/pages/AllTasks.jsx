import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TaskService } from '../../services/TaskService';
import { toast } from 'react-toastify';

const AllTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await TaskService.getAllTasks();
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

    const handleDelete = async (taskId) => {
        if(window.confirm('Are you sure you want to delete this task?')){
            try {
                await TaskService.deleteTask(taskId);
                setTasks(tasks.filter(task => task.id !== taskId));
                toast.success('Task deleted successfully');
            } catch (error) {
                console.error('Error deleting task:', error);
                toast.error(error.response?.data?.message || 'Failed to delete task');
            }
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">All Tasks</h4>
                            <Link to="/create-task" className="btn btn-primary">Create New Task</Link>
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
                                                <th>Assignee</th>
                                                <th>Assigned By</th>
                                                <th>Due Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tasks.map(task => (
                                                <tr key={task.id}>
                                                    <td>{task.title}</td>
                                                    <td>{task.assignee?.firstName} {task.assignee?.lastName}</td>
                                                    <td>{task.assigner?.firstName} {task.assigner?.lastName}</td>
                                                    <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`badge ${task.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Link to={`/task/${task.id}`} className="btn btn-sm btn-info me-2">View</Link>
                                                        <button onClick={() => handleDelete(task.id)} className="btn btn-sm btn-danger me-2">Delete</button>
                                                        {task.status === 'submitted' && (
                                                            <Link to={`/task/${task.id}`} className="btn btn-sm btn-primary">Review</Link>
                                                        )}
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

export default AllTasks;
