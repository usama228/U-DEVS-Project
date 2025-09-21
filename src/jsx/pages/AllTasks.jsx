import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';
import { TaskService } from '../../services/TaskService';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import PageTitle from '../layouts/PageTitle';

const AllTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const debouncedSearch = useCallback(debounce((value) => {
        setSearch(value);
        setCurrentPage(1); 
    }, 500), []);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: 10,
                search,
                status: statusFilter,
                priority: priorityFilter,
            };
            const response = await TaskService.getAllTasks(params);
            if (response.data.success) {
                setTasks(response.data.data.tasks);
                setTotalPages(response.data.data.pagination.totalPages);
            } else {
                toast.error(response.data.message || 'Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error(error.response?.data?.message || 'An error occurred while fetching tasks');
        } finally {
            setLoading(false);
        }
    }, [currentPage, search, statusFilter, priorityFilter]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleDelete = async (taskId) => {
        if(window.confirm('Are you sure you want to delete this task?')){
            try {
                await TaskService.deleteTask(taskId);
                toast.success('Task deleted successfully');
                fetchTasks(); // Re-fetch tasks after deletion
            } catch (error) {
                console.error('Error deleting task:', error);
                toast.error(error.response?.data?.message || 'Failed to delete task');
            }
        }
    };

    const handlePageChange = (page) => setCurrentPage(page);
    
    const getStatusBadge = (status) => {
        switch (status) {
            case 'assigned': return 'badge-primary';
            case 'submitted': return 'badge-warning';
            case 'accepted': return 'badge-success';
            case 'rejected': return 'badge-danger';
            default: return 'badge-secondary';
        }
    };

    return (
        <>
            <PageTitle activeMenu="All Tasks" motherMenu="Tasks" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title">All Tasks</h4>
                                <Link to="/create-task" className="btn btn-primary">Create New Task</Link>
                            </div>
                            <div className="card-body">
                                <div className="mb-3 d-flex justify-content-between align-items-center">
                                    <div className="w-50">
                                        <input 
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by title..."
                                            onChange={(e) => debouncedSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="d-flex">
                                        <select className="form-control me-2" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                                            <option value="">All Statuses</option>
                                            <option value="assigned">Assigned</option>
                                            <option value="submitted">Submitted</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        <select className="form-control" value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}>
                                            <option value="">All Priorities</option>
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Assignee</th>
                                                <th>Assigned By</th>
                                                <th>Due Date</th>
                                                <th>Status</th>
                                                <th>Priority</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr><td colSpan="7" className="text-center">Loading...</td></tr>
                                            ) : tasks.length === 0 ? (
                                                <tr><td colSpan="7" className="text-center">No tasks found</td></tr>
                                            ) : (
                                                tasks.map(task => (
                                                    <tr key={task.id}>
                                                        <td>{task.title}</td>
                                                        <td>{task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'N/A'}</td>
                                                        <td>{task.assigner ? `${task.assigner.firstName} ${task.assigner.lastName}` : 'N/A'}</td>
                                                        <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                                                        <td><span className={`badge ${getStatusBadge(task.status)}`}>{task.status}</span></td>
                                                        <td>{task.priority}</td>
                                                        <td>
                                                            <Link to={`/task/${task.id}`} className="btn btn-sm btn-info me-2">View</Link>
                                                            <button onClick={() => handleDelete(task.id)} className="btn btn-sm btn-danger">Delete</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 1 && (
                                    <Pagination className="justify-content-center">
                                        {[...Array(totalPages).keys()].map(num => (
                                            <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => handlePageChange(num + 1)}>
                                                {num + 1}
                                            </Pagination.Item>
                                        ))}
                                    </Pagination>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllTasks;
