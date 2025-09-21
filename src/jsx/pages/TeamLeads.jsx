import React, { useState, useEffect, useCallback } from 'react';
import { Pagination } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import { UserService } from '../../services/UserService';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { IMAGE_URL } from '../../config';
import ImageModal from '../../components/ImageModal';
import { IMAGES } from '../constant/theme';

const TeamLeads = () => {
    const [teamLeads, setTeamLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const debouncedSearch = useCallback(debounce((value) => {
        setSearch(value);
        setCurrentPage(1);
    }, 500), []);

    const fetchTeamLeads = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: 10,
                search,
                role: 'team_lead',
                status: statusFilter,
            };
            const response = await UserService.getAllUsers(params);
            if (response.data.success) {
                setTeamLeads(response.data.data.users);
                setTotalPages(response.data.data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Error fetching team leads:', error);
            toast.error('Failed to load team leads');
        } finally {
            setLoading(false);
        }
    }, [currentPage, search, statusFilter]);

    useEffect(() => {
        fetchTeamLeads();
    }, [fetchTeamLeads]);

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <>
            <PageTitle activeMenu="Team Leads" motherMenu="User Management" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title">All Team Leads</h4>
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
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr><td colSpan="4" className="text-center">Loading...</td></tr>
                                            ) : teamLeads.length === 0 ? (
                                                <tr><td colSpan="4" className="text-center">No team leads found</td></tr>
                                            ) : (
                                                teamLeads.map((user) => (
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
                                                        <td><span className={`badge ${user.isActive ? 'badge-success' : 'badge-secondary'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
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

export default TeamLeads;
