import React, { useState, useEffect, useCallback } from 'react';
import { Pagination } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import { SVGICON } from '../components/bootstrap/SVGICON';
import { useAttendance } from '../../hooks/useAttendance';

const Attendance = () => {
    const {
        attendanceData,
        todayAttendance,
        loading,
        actionLoading,
        fetchAttendanceData,
        fetchTodayAttendance,
        handleCheckIn,
        handleCheckOut,
        userDetails
    } = useAttendance();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dateFilter, setDateFilter] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    
    const userRole = userDetails?.role;

    useEffect(() => {
        fetchAttendanceData(dateFilter.startDate, dateFilter.endDate);
        fetchTodayAttendance();
    }, [fetchAttendanceData, fetchTodayAttendance, dateFilter]);

    useEffect(() => {
        setTotalPages(Math.ceil(attendanceData.length / 10));
    }, [attendanceData]);

    const onCheckIn = async () => {
        const success = await handleCheckIn();
        if (success) {
            fetchAttendanceData(dateFilter.startDate, dateFilter.endDate);
        }
    };

    const onCheckOut = async () => {
        const success = await handleCheckOut();
        if (success) {
            fetchAttendanceData(dateFilter.startDate, dateFilter.endDate);
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return '-';
        return new Date(timeString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateWorkingHours = (checkInTime, checkOutTime) => {
        if (!checkInTime || !checkOutTime) return '-';
        const diff = new Date(checkOutTime) - new Date(checkInTime);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const [currentTime, setCurrentTime] = useState(getCurrentTime());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const paginatedData = attendanceData.slice((currentPage - 1) * 10, currentPage * 10);

    return (
        <>
            <PageTitle activeMenu="Attendance" motherMenu="Management" />
            <div className="container-fluid">
                {/* Today's Attendance Card */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card" style={{ background: 'linear-gradient(135deg, #4D44B5 0%, #6C5CE7 100%)', color: 'white', border: 'none' }}>
                            <div className="card-body p-4">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <h3 className="text-white mb-2">Today's Attendance</h3>
                                        <p className="mb-1 fs-5">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <p className="mb-0 fs-4 fw-bold">{currentTime}</p>
                                    </div>
                                    <div className="col-md-6 text-md-end">
                                        <div className="d-flex flex-column align-items-md-end">
                                            {todayAttendance ? (
                                                <>
                                                    <div className="mb-3">
                                                        <span className="badge bg-success fs-6 px-3 py-2 mb-2">Checked In: {formatTime(todayAttendance.checkInTime)}</span>
                                                        {todayAttendance.checkOutTime && (
                                                            <span className="badge bg-info fs-6 px-3 py-2 ms-2">Checked Out: {formatTime(todayAttendance.checkOutTime)}</span>
                                                        )}
                                                    </div>
                                                    {!todayAttendance.checkOutTime ? (
                                                        <button 
                                                            className="btn btn-light btn-lg px-4" 
                                                            onClick={onCheckOut}
                                                            disabled={actionLoading}
                                                        >
                                                            <SVGICON icon="cancel" className="me-2" />
                                                            {actionLoading ? 'Processing...' : 'Check Out'}
                                                        </button>
                                                    ) : (
                                                        <div className="text-center">
                                                            <span className="badge bg-light text-dark fs-6 px-3 py-2">
                                                                Working Hours: {calculateWorkingHours(todayAttendance.checkInTime, todayAttendance.checkOutTime)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <button 
                                                    className="btn btn-light btn-lg px-4" 
                                                    onClick={onCheckIn}
                                                    disabled={actionLoading}
                                                >
                                                    <SVGICON icon="check-circle" className="me-2" />
                                                    {actionLoading ? 'Processing...' : 'Check In'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance History */}
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="card-title">Attendance History</h4>
                                <div className="d-flex gap-2">
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        value={dateFilter.startDate}
                                        onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                                        style={{ width: 'auto' }}
                                    />
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        value={dateFilter.endDate}
                                        onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                                        style={{ width: 'auto' }}
                                    />
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Check In</th>
                                                <th>Check Out</th>
                                                <th>Working Hours</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                                            ) : paginatedData.length === 0 ? (
                                                <tr><td colSpan="5" className="text-center py-4">No attendance records found</td></tr>
                                            ) : (
                                                paginatedData.map((record, index) => (
                                                    <tr key={index}>
                                                        <td>{formatDate(record.date)}</td>
                                                        <td>
                                                            <span className="badge bg-success-light text-success">
                                                                {formatTime(record.checkInTime)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {record.checkOutTime ? (
                                                                <span className="badge bg-info-light text-info">
                                                                    {formatTime(record.checkOutTime)}
                                                                </span>
                                                            ) : (
                                                                <span className="badge bg-warning-light text-warning">Not checked out</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <span className="fw-bold">
                                                                {calculateWorkingHours(record.checkInTime, record.checkOutTime)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${
                                                                record.checkOutTime ? 'bg-success' : 'bg-warning'
                                                            }`}>
                                                                {record.checkOutTime ? 'Complete' : 'In Progress'}
                                                            </span>
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
        </>
    );
};

export default Attendance;
