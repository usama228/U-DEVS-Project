import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications, markAllAsRead } from '../../services/NotificationService';
import PageTitle from '../layouts/PageTitle';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications();
            console.log('Notifications response:', response);
            if (response.success) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    return (
        <>
                            <PageTitle activeMenu="Dashboard" motherMenu="Home" />
                     
                <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="card-title">All Notifications</h4>
                            <button className="btn btn-primary" onClick={handleMarkAllAsRead}>
                                Mark All as Read
                            </button>
                        </div>
                        <div className="card-body">
                            <ul className="list-group">
                                {notifications.map(notification => (
                                    <Link to={notification.link ? `/${notification.link.replace(/^\/+/, "")}` : "#"}
                            key={notification.id} className={`list-group-item list-group-item-action ${notification.isRead ? "" : "font-weight-bold"}`}>
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{notification.message}</h5>
                                <small>{new Date(notification.createdAt).toLocaleString()}</small>
                            </div>
                            <p className="mb-1">
                                From: {notification.senderUser?.firstName} {notification.senderUser?.lastName}
                            </p>
                            </Link>
                                ))}
                                {notifications.length === 0 && <p>No notifications found.</p>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                                    </>
    );
};

export default NotificationsPage;
