import React, { useState, useEffect } from 'react';
import { Modal, Pagination } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import { SVGICON } from '../components/bootstrap/SVGICON';
import { useLeaves } from '../../hooks/useLeaves';
import Swal from 'sweetalert2';

const Leaves = () => {
    const {
        leaves,
        loading,
        actionLoading,
        fetchLeaves,
        submitLeave,
        updateStatus,
        removeLeave,
        userDetails,
        userRole
    } = useLeaves();

    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [leaveForm, setLeaveForm] = useState({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        fetchLeaves();
    }, [fetchLeaves]);

    const filteredLeaves = leaves.filter(leave => 
        statusFilter === '' || leave.status === statusFilter
    );

    const totalPages = Math.ceil(filteredLeaves.length / 10);
    const paginatedLeaves = filteredLeaves.slice((currentPage - 1) * 10, currentPage * 10);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await submitLeave(leaveForm);
        if (success) {
            setShowModal(false);
            setLeaveForm({ leaveType: '', startDate: '', endDate: '', reason: '' });
        }
    };

    const handleStatusUpdate = async (leaveId, status) => {
        let rejectionReason = null;
        
        if (status === 'rejected') {
            const { value: reason } = await Swal.fire({
                title: 'Reject Leave Request',
                input: 'textarea',
                inputLabel: 'Rejection Reason',
                inputPlaceholder: 'Please provide a reason for rejection...',
                inputAttributes: {
                    'aria-label': 'Type your rejection reason here'
                },
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Reject Leave',
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to provide a rejection reason!'
                    }
                }
            });
            
            if (!reason) return; // User cancelled
            rejectionReason = reason;
        } else {
            const result = await Swal.fire({
                title: `${status.charAt(0).toUpperCase() + status.slice(1)} Leave?`,
                text: `Are you sure you want to ${status} this leave request?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d',
                confirmButtonText: `Yes, ${status} it!`
            });
            
            if (!result.isConfirmed) return;
        }

        await updateStatus(leaveId, status, rejectionReason);
    };

    const handleDelete = async (leaveId) => {
        const result = await Swal.fire({
            title: 'Delete Leave?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            await removeLeave(leaveId);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateDays = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { class: 'bg-warning', text: 'Pending' },
            approved: { class: 'bg-success', text: 'Approved' },
            rejected: { class: 'bg-danger', text: 'Rejected' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <span className={`badge ${config.class}`}>{config.text}</span>;
    };

    const canManageLeaves = userRole === 'admin' || userRole === 'team_lead';

    return (
        <>
            <PageTitle activeMenu="Leaves" motherMenu="Management" />
            <div className="container-fluid">
                {/* Stats Cards */}
                <div className="row mb-4">
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-body d-flex align-items-center">
                                <div className="icon-box bg-primary-light me-3">
                                    <SVGICON icon="calendar" className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="mb-1">{leaves.length}</h3>
                                    <p className="mb-0">Total Leaves</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-body d-flex align-items-center">
                                <div className="icon-box bg-warning-light me-3">
                                    <SVGICON icon="pending" className="text-warning" />
                                </div>
                                <div>
                                    <h3 className="mb-1">{leaves.filter(l => l.status === 'pending').length}</h3>
                                    <p className="mb-0">Pending</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-body d-flex align-items-center">
                                <div className="icon-box bg-success-light me-3">
                                    <SVGICON icon="check-circle" className="text-success" />
                                </div>
                                <div>
                                    <h3 className="mb-1">{leaves.filter(l => l.status === 'approved').length}</h3>
                                    <p className="mb-0">Approved</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-body d-flex align-items-center">
                                <div className="icon-box bg-danger-light me-3">
                                    <SVGICON icon="cancel" className="text-danger" />
                                </div>
                                <div>
                                    <h3 className="mb-1">{leaves.filter(l => l.status === 'rejected').length}</h3>
                                    <p className="mb-0">Rejected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaves Table */}
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title">Leave Requests</h4>
                                <div className="d-flex gap-2">
                                    <select 
                                        className="form-control" 
                                        value={statusFilter} 
                                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                        style={{ width: 'auto' }}
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={() => setShowModal(true)}
                                    >
                                        <SVGICON icon="add-task" className="me-2" />
                                        Request Leave
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                {canManageLeaves && <th>Employee</th>}
                                                <th>Leave Type</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>Days</th>
                                                <th>Status</th>
                                                <th>Reason</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr><td colSpan={canManageLeaves ? "8" : "7"} className="text-center py-4">Loading...</td></tr>
                                            ) : paginatedLeaves.length === 0 ? (
                                                <tr><td colSpan={canManageLeaves ? "8" : "7"} className="text-center py-4">No leave requests found</td></tr>
                                            ) : (
                                                paginatedLeaves.map((leave) => (
                                                    <tr key={leave.id}>
                                                        {canManageLeaves && (
                                                            <td>
                                                                <p className="mb-0">{leave.user?.firstName} {leave.user?.lastName}</p>
                                                                <small className="text-muted">{leave.user?.email}</small>
                                                            </td>
                                                        )}
                                                        <td>
                                                            <span className="badge bg-info-light text-info">
                                                                {leave.leaveType?.replace('_', ' ').toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td>{formatDate(leave.startDate)}</td>
                                                        <td>{formatDate(leave.endDate)}</td>
                                                        <td>
                                                            <span className="fw-bold">
                                                                {calculateDays(leave.startDate, leave.endDate)} days
                                                            </span>
                                                        </td>
                                                        <td>{getStatusBadge(leave.status)}</td>
                                                        <td>
                                                            <span className="text-truncate" style={{ maxWidth: '150px', display: 'inline-block' }} title={leave.reason}>
                                                                {leave.reason}
                                                            </span>
                                                            {leave.status === 'rejected' && leave.rejectionReason && (
                                                                <div className="mt-1">
                                                                    <small className="text-danger">
                                                                        <strong>Rejection:</strong> {leave.rejectionReason}
                                                                    </small>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                {canManageLeaves && leave.status === 'pending' && (
                                                                    <>
                                                                        <button 
                                                                            className="btn btn-success btn-sm" 
                                                                            onClick={() => handleStatusUpdate(leave.id, 'approved')}
                                                                            disabled={actionLoading}
                                                                        >
                                                                            <SVGICON icon="check-circle" />
                                                                        </button>
                                                                        <button 
                                                                            className="btn btn-danger btn-sm" 
                                                                            onClick={() => handleStatusUpdate(leave.id, 'rejected')}
                                                                            disabled={actionLoading}
                                                                        >
                                                                            <SVGICON icon="cancel" />
                                                                        </button>
                                                                    </>
                                                                )}
                                                                {(leave.userId === userDetails?.id && leave.status === 'pending') && (
                                                                    <button 
                                                                        className="btn btn-outline-danger btn-sm" 
                                                                        onClick={() => handleDelete(leave.id)}
                                                                        disabled={actionLoading}
                                                                    >
                                                                        <SVGICON icon="delete" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 1 && (
                                    <Pagination className="justify-content-center mt-3">
                                        {[...Array(totalPages).keys()].map(num => (
                                            <Pagination.Item 
                                                key={num + 1} 
                                                active={num + 1 === currentPage} 
                                                onClick={() => setCurrentPage(num + 1)}
                                            >
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

            {/* Leave Request Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Request Leave</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Leave Type</label>
                                <select 
                                    className="form-control" 
                                    value={leaveForm.leaveType} 
                                    onChange={(e) => setLeaveForm(prev => ({ ...prev, leaveType: e.target.value }))}
                                    required
                                >
                                    <option value="">Select Leave Type</option>
                                    <option value="sick_leave">Sick Leave</option>
                                    <option value="casual_leave">Casual Leave</option>
                                    <option value="annual_leave">Annual Leave</option>
                                    <option value="maternity_leave">Maternity Leave</option>
                                    <option value="paternity_leave">Paternity Leave</option>
                                    <option value="emergency_leave">Emergency Leave</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Duration</label>
                                <div className="text-muted">
                                    {leaveForm.startDate && leaveForm.endDate && 
                                        `${calculateDays(leaveForm.startDate, leaveForm.endDate)} days`
                                    }
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Start Date</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    value={leaveForm.startDate}
                                    onChange={(e) => setLeaveForm(prev => ({ ...prev, startDate: e.target.value }))}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">End Date</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    value={leaveForm.endDate}
                                    onChange={(e) => setLeaveForm(prev => ({ ...prev, endDate: e.target.value }))}
                                    min={leaveForm.startDate || new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div className="col-12 mb-3">
                                <label className="form-label">Reason</label>
                                <textarea 
                                    className="form-control" 
                                    rows="3" 
                                    value={leaveForm.reason}
                                    onChange={(e) => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
                                    placeholder="Please provide a reason for your leave request..."
                                    required
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                            {actionLoading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
};

export default Leaves;
