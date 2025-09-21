import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import { UserService } from '../../services/UserService';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { IMAGE_URL } from '../../config';
import ImageModal from '../../components/ImageModal';
import { IMAGES } from '../constant/theme';
import { getUserDetails } from '../../services/AuthService';

const Interns = () => {
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const loggedInUser = getUserDetails();

    const debouncedSearch = useCallback(debounce((value) => {
        setSearch(value);
        setCurrentPage(1);
    }, 500), []);

    const fetchInterns = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: 10,
                search,
                role: 'internee',
                status: statusFilter,
            };
            const response = await UserService.getAllUsers(params);
            if (response.data.success) {
                setInterns(response.data.data.users);
                setTotalPages(response.data.data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Error fetching interns:', error);
            toast.error('Failed to load interns');
        } finally {
            setLoading(false);
        }
    }, [currentPage, search, statusFilter]);

    useEffect(() => {
        fetchInterns();
    }, [fetchInterns]);

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <>
            <PageTitle activeMenu="Interns" motherMenu="User Management" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title">All Interns</h4>
                            </div>
                            <div className="card-body">
                                <div className="mb-3 d-flex justify-content-between align-items-center">
                                    <div className="w-50">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by name or email..."
                                            onChange={(e) => debouncedSearch(e.target.value)}
                                        />
                                    </div>
                                    <select className="form-control w-auto" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                                        <option value="">All Statuses</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Avatar</th>
                                                <th>Name</th>
                                                <th>Contact</th>
                                                <th>Team Lead</th>
                                                <th>Status</th>
                                                {loggedInUser && loggedInUser.role === 'team_lead' && <th>Actions</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr><td colSpan={loggedInUser && loggedInUser.role === 'team_lead' ? "6" : "5"} className="text-center">Loading...</td></tr>
                                            ) : interns.length === 0 ? (
                                                <tr><td colSpan={loggedInUser && loggedInUser.role === 'team_lead' ? "6" : "5"} className="text-center">No interns found</td></tr>
                                            ) : (
                                                interns.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>
                                                            <ImageModal
                                                                src={user.profilePicture ? `${IMAGE_URL}${user.profilePicture}` : IMAGES.avatar}
                                                                alt={`${user.firstName} ${user.lastName}`}
                                                                className="avatar avatar-md rounded-circle"
                                                            />
                                                        </td>
                                                        <td>
                                                            <p className="mb-0">{user.firstName} {user.lastName}</p>
                                                            <small className="text-muted">{user.email}</small>
                                                        </td>
                                                        <td>{user.phone}</td>
                                                        <td>{user.teamLead ? `${user.teamLead.firstName} ${user.teamLead.lastName}` : '-'}</td>
                                                        <td><span className={`badge ${user.isActive ? 'badge-success' : 'badge-secondary'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                                                        {loggedInUser && loggedInUser.role === 'team_lead' && (
                                                            <td>
                                                                <Link to={`/user-profile/${user.id}`} className="btn btn-primary btn-sm">View Profile</Link>
                                                            </td>
                                                        )}
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

export default Interns;
