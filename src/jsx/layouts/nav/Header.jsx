import React, { useState, useEffect, useContext, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";
/// Scroll
import { Dropdown } from "react-bootstrap";

import LogoutPage from './Logout';
import { getUserDetails } from '../../../services/AuthService';
import { getNotifications, markAsRead, markAllAsRead } from '../../../services/NotificationService';


/// Image
import avatar from "../../../assets/images/avatar/1.jpg";
import avatar2 from "../../../assets/images/avatar/2.jpg";
import avatar3 from "../../../assets/images/avatar/3.jpg";
import avatar4 from "../../../assets/images/avatar/4.jpg";
import { ThemeContext } from "../../../context/ThemeContext";
import IMAGES from "../../constant/theme";
import { IMAGE_URL } from "../../../config";

const searchList = [
	{ image: avatar, title: 'Benjamin' },
	{ image: avatar2, title: 'Oliver' },
	{ image: avatar3, title: 'Lucas' },
	{ image: avatar4, title: 'Harry' },
	{ image: avatar2, title: 'Oliver' },
	{ image: avatar4, title: 'Harry' },
	{ image: avatar, title: 'Benjamin' },
	{ image: avatar3, title: 'Lucas' },
];

export function SideBarAdd() {
	setTimeout(() => {
		let walletopen = document.querySelector(".wallet-open");
		if (walletopen.classList.contains('active')) {
			walletopen.classList.remove("active");
		} else {
			walletopen.classList.add("active");
		}
	}, 200);
}

const Header = ({ onNote }) => {
	const { background, changeBackground } = useContext(ThemeContext);
	const navigate = useNavigate();
	const [userDetails, setUserDetails] = useState(null);
	const [notifications, setNotifications] = useState([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [imgSrc, setImgSrc] = useState(IMAGES.avatar);

	const handleError = () => {
			setImgSrc(IMAGES.avatar);
		};

	const handleThemeMode = () => {
		if (background.value === 'dark') {
			changeBackground({ value: "light", label: "Light" });
		} else {
			changeBackground({ value: "dark", label: "Dark" });
		}
	}

	useEffect(() => {
		// Get user details
		const fetchUserDetails = () => {
			try {
				const details = getUserDetails();
				setUserDetails(details);
				var img = `${IMAGE_URL}${details?.profilePicture}`
				setImgSrc(img || IMAGES.avatar);
			} catch (error) {
				console.error('Error fetching user details:', error);
			}
		};
        const fetchNotifications = async () => {
            try {
                const response = await getNotifications();
                if (response.success) {
                    setNotifications(response.data.notifications);
                    setUnreadCount(response.data.notifications.filter(n => !n.isRead).length);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };		fetchUserDetails();
		fetchNotifications();
	}, [userDetails?.profilePicture]);

	// Format role for display
	const formatRole = (role) => {
		if (!role) return 'User';
		return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
	};

	const fetchNotifications = async () => {
        try {
            const response = await getNotifications();
            if (response.success) {
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.notifications.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

	const handleNotificationClick = async (notification) => {
        try {
            // Mark the notification as read locally first
            const updatedNotifications = notifications.map(n => 
                n.id === notification.id ? { ...n, isRead: true } : n
            );
            setNotifications(updatedNotifications);
            setUnreadCount(updatedNotifications.filter(n => !n.isRead).length);

            // Then update in the backend
            await markAsRead(notification.id);
            
            if (notification.link) {
                navigate(notification.link);
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            // Revert changes if the backend update fails
            await fetchNotifications();
        }
    };    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            // Refresh notifications and unread count
            const response = await getNotifications();
            if (response.success) {
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.notifications.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

	const fullscreenRef = useRef(null);
	const EnterFullScreen = () => {
		if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {

			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}
		else { /* exit fullscreen */
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if (document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.msRequestFullscreen) {
				document.documentElement.msRequestFullscreen();
			}
		}
	};

	var path = window.location.pathname.split("/");
	var name = path[path.length - 1].split("-");
	var filterName = name.length >= 3 ? name.filter((n, i) => i > 0) : name;
	var finalName = filterName.includes("app")
		? filterName.filter((f) => f !== "app")
		: filterName.includes("ui")
			? filterName.filter((f) => f !== "ui")
			: filterName.includes("uc")
				? filterName.filter((f) => f !== "uc")
				: filterName.includes("basic")
					? filterName.filter((f) => f !== "basic")
					: filterName.includes("jquery")
						? filterName.filter((f) => f !== "jquery")
						: filterName.includes("table")
							? filterName.filter((f) => f !== "table")
							: filterName.includes("page")
								? filterName.filter((f) => f !== "page")
								: filterName.includes("email")
									? filterName.filter((f) => f !== "email")
									: filterName.includes("ecom")
										? filterName.filter((f) => f !== "ecom")
										: filterName.includes("chart")
											? filterName.filter((f) => f !== "chart")
											: filterName.includes("editor")
												? filterName.filter((f) => f !== "editor")
												: filterName;


	return (
		<div className="header">
			<div className="header-content">
				<nav className="navbar navbar-expand">
					<div className="collapse navbar-collapse justify-content-between">
						<div className="header-left">
							<div
								className="dashboard_bar"
								style={{ textTransform: "capitalize" }}
							>
								{finalName.join(" ").length === 0
									? "Dashboard"
									: finalName.join(" ") === "dashboard dark"
										? "Dashboard"
										: finalName.join(" ")}
							</div>
						</div>
						<ul className="navbar-nav header-right">
							<Dropdown as="li" className="nav-item notification_dropdown search-area-header">
								<Dropdown.Toggle as="div" className="nav-link i-false">
									<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M27.6 25.8L22 20.2C23.3 18.5 24.1 16.4 24.1 14.1C24.1 8.60001 19.6 4.10001 14.1 4.10001C8.6 4.10001 4 8.60001 4 14.1C4 19.6 8.5 24.1 14 24.1C16.3 24.1 18.5 23.3 20.2 21.9L25.8 27.5C26 27.7 26.4 27.9 26.7 27.9C27 27.9 27.3 27.8 27.6 27.5C28.1 27.1 28.1 26.3 27.6 25.8ZM6.5 14.1C6.5 10 9.9 6.60001 14 6.60001C18.1 6.60001 21.5 10 21.5 14.1C21.5 18.2 18.1 21.6 14 21.6C9.9 21.6 6.5 18.3 6.5 14.1Z" fill="#A098AE" />
									</svg>
								</Dropdown.Toggle>
								<Dropdown.Menu className="dropdown-menu-end p-0 rounded" align={'end'}>
									<div className="card mb-0">
										<div className="card-body px-0">
											<div className="px-3">
												<div className="input-group search-area w-100">
													<input type="text" className="form-control" placeholder="Search here..." />
													<span className="input-group-text"><Link to={"#"}>
														<svg width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M17.5605 15.4395L13.7527 11.6317C14.5395 10.446 15 9.02625 15 7.5C15 3.3645 11.6355 0 7.5 0C3.3645 0 0 3.3645 0 7.5C0 11.6355 3.3645 15 7.5 15C9.02625 15 10.446 14.5395 11.6317 13.7527L15.4395 17.5605C16.0245 18.1462 16.9755 18.1462 17.5605 17.5605C18.1462 16.9747 18.1462 16.0252 17.5605 15.4395V15.4395ZM2.25 7.5C2.25 4.605 4.605 2.25 7.5 2.25C10.395 2.25 12.75 4.605 12.75 7.5C12.75 10.395 10.395 12.75 7.5 12.75C4.605 12.75 2.25 10.395 2.25 7.5V7.5Z" fill="#01A3FF"></path>
														</svg>
													</Link></span>
												</div>
												<h6 className="my-2 mt-3">Recently Searched:</h6>
											</div>
											<div className="dlab-scroll px-3 mt-3 height300">
												{searchList.map((item, index) => (
													<ul className="d-flex align-items-center mb-3" key={index}>
														<li>
															<img src={item.image} className="avatar avatar-sm" alt="" />
															<Link to={"#"} className="ms-2">{item.title}</Link>
														</li>
														<li className="ms-auto"><i className="fa-solid fa-trash"></i></li>
													</ul>
												))}
											</div>
										</div>
									</div>
								</Dropdown.Menu>
							</Dropdown>
							<li className="nav-item dropdown notification_dropdown">
								<Link to={"#"} className="nav-link  menu-wallet"
									onClick={SideBarAdd}
								>
									<svg id="Layer_2" enableBackground="new 0 0 512 512" height="18" viewBox="0 0 512 512" width="18" xmlns="http://www.w3.org/2000/svg"><g><path d="m174 240h-108c-36.393 0-66-29.607-66-66v-108c0-36.393 29.607-66 66-66h108c36.393 0 66 29.607 66 66v108c0 36.393-29.607 66-66 66zm-108-208c-18.748 0-34 15.252-34 34v108c0 18.748 15.252 34 34 34h108c18.748 0 34-15.252 34-34v-108c0-18.748-15.252-34-34-34z" /><path d="m446 240h-108c-36.393 0-66-29.607-66-66v-108c0-36.393 29.607-66 66-66h108c36.393 0 66 29.607 66 66v108c0 36.393-29.607 66-66 66zm-108-208c-18.748 0-34 15.252-34 34v108c0 18.748 15.252 34 34 34h108c18.748 0 34-15.252 34-34v-108c0-18.748-15.252-34-34-34z" /><path d="m392 512c-66.168 0-120-53.832-120-120s53.832-120 120-120 120 53.832 120 120-53.832 120-120 120zm0-208c-48.523 0-88 39.477-88 88s39.477 88 88 88 88-39.477 88-88-39.477-88-88-88z" /><path d="m174 512h-108c-36.393 0-66-29.607-66-66v-108c0-36.393 29.607-66 66-66h108c36.393 0 66 29.607 66 66v108c0 36.393-29.607 66-66 66zm-108-208c-18.748 0-34 15.252-34 34v108c0 18.748 15.252 34 34 34h108c18.748 0 34-15.252 34-34v-108c0-18.748-15.252-34-34-34z" /></g></svg>
								</Link>
							</li>
							<li className="nav-item dropdown notification_dropdown">
								<Link to={"#"} className={`nav-link bell dz-theme-mode ${background.value === "dark" ? "active" : ""}`}
									onClick={() => handleThemeMode()}
								>
									<i id="icon-light-1">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
									</i>
									<i id="icon-dark-1">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
									</i>
								</Link>
							</li>
							<li className="nav-item dropdown notification_dropdown">
								<Link to={"#"} className="nav-link bell dz-fullscreen"
									ref={fullscreenRef}
									onClick={EnterFullScreen}
								>
									<svg id="icon-full-1" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" style={{ strokeDasharray: "37, 57", strokeDashoffset: "0" }}></path></svg>
									<svg id="icon-minimize-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="A098AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minimize"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" style={{ strokeDasharray: "37, 57", strokeDashoffset: "0" }}></path></svg>
								</Link>
							</li>
						
							<Dropdown as="li" className="nav-item notification_dropdown">
                                <Dropdown.Toggle className="nav-link i-false c-pointer position-relative" variant="" as="a">
                                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M25.3677 18.9391V9.86768C25.3677 4.70215 21.1655 0.5 16 0.5C10.8345 0.5 6.63232 4.70215 6.63232 9.86768V18.9397C4.96704 19.4224 3.73828 20.9544 3.73828 22.8374C3.73828 25.0386 5.5293 26.8296 7.73096 26.8296H11.377V26.877C11.377 29.4263 13.4507 31.5 16 31.5C18.5493 31.5 20.6231 29.4263 20.6231 26.8769V26.8296H24.2691C26.4707 26.8296 28.2617 25.0386 28.2617 22.7583C28.2617 20.9406 27.033 19.4198 25.3677 18.9391ZM9.63232 9.86768C9.63232 6.35645 12.4888 3.5 16 3.5C19.5112 3.5 22.3677 6.35645 22.3677 9.86768V18.7661H9.63232V9.86768ZM17.6231 26.8769C17.6231 27.772 16.895 28.5 16 28.5C15.105 28.5 14.377 27.772 14.377 26.8769V26.8296H17.623V26.8769H17.6231ZM24.269 23.8296H7.73096C7.1836 23.8296 6.73828 23.3843 6.73828 22.7583C6.73828 22.2114 7.18359 21.7661 7.73096 21.7661H24.2691C24.8164 21.7661 25.2617 22.2114 25.2617 22.8374C25.2617 23.3843 24.8164 23.8296 24.269 23.8296Z" fill="#A098AE" />
                                    </svg>
                                    {unreadCount > 0 && (
                                        <div 
                                            className="position-absolute bg-primary rounded-circle d-flex align-items-center justify-content-center"
                                            style={{
                                                top: '0px',
                                                right: '-8px',
                                                width: '16px',
                                                height: '16px',
                                                fontSize: '10px',
                                                color: 'white',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {unreadCount}
                                        </div>
                                    )}
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" className="dropdown-menu mt-2 dropdown-menu-end of-visible">
                                    <div className="dropdown-header d-flex justify-content-between align-items-center p-3">
                                        <h4 className="title mb-0">Notification</h4>
                                        <Link to="#" onClick={handleMarkAllAsRead}>Mark all as read</Link>
                                    </div>
                                    <div className="notification-list p-3" style={{ maxHeight: "380px", overflowY: "auto" }}>
                                        {notifications.map((notification) => (
                                            <div 
                                                key={notification.id} 
                                                onClick={() => handleNotificationClick(notification)} 
                                                className={`notification-item d-flex align-items-center p-2 border-bottom ${!notification.isRead ? 'bg-light' : ''}`}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div 
                                                    className={`notification-indicator me-2 ${notification.isRead ? 'bg-info' : 'bg-primary'}`} 
                                                    style={{ 
                                                        width: '8px', 
                                                        height: '8px', 
                                                        borderRadius: '50%',
                                                        flexShrink: 0
                                                    }}
                                                />
                                                <div>
                                                    <div className={`notification-text ${!notification.isRead ? 'fw-bold' : ''}`}>
                                                        {notification.message}
                                                    </div>
                                                    <small className="text-muted">
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </small>
                                                </div>
                                            </div>
                                        ))}
                                        {notifications.length === 0 && (
                                            <div className="text-center p-3">
                                                <p className="mb-0">No new notifications</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-top p-2 text-center">
                                        <Link to="/notifications" className="text-primary">
                                            See all notifications
                                        </Link>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>

							<li className="nav-item ">
								<Dropdown className="dropdown header-profile2">
									<Dropdown.Toggle variant="" as="a" className="nav-link i-false c-pointer ms-0">
										<div className="header-info2 d-flex align-items-center">
											<img src={imgSrc || IMAGES.avatar} alt="Profile" onError={handleError} />
										</div>
									</Dropdown.Toggle>
									<Dropdown.Menu align="end" className="mt-1 dropdown-menu dropdown-menu-end" >
										<div className="card mb-0">
											<div className="card-header p-3">
												<ul className="d-flex align-items-center">
													<li>
														<img src={imgSrc || IMAGES.avatar} alt="Profile" onError={handleError} />
													</li>
													<li className="ms-2">
														<h4 className="mb-0">
															{userDetails ? 
																`${userDetails.firstName} ${userDetails.lastName}` 
																: 'User'
															}
														</h4>
														<span>{formatRole(userDetails?.role)}</span>
													</li>
												</ul>

											</div>
											<div className="card-body p-3">
												<Link to="/profile" className="dropdown-item ai-icon">
													<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" className="svg-main-icon">
														<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
															<polygon points="0 0 24 0 24 24 0 24" />
															<path d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z" fill="#000000" fillRule="nonzero" opacity="0.3" />
															<path d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z" fill="var(--primary)" fillRule="nonzero" />
														</g>
													</svg>
													<span className="ms-2">Profile </span>
												</Link>
												</div>
											<div className="card-footer text-center p-3">
												<LogoutPage />
											</div>
										</div>
									</Dropdown.Menu>
								</Dropdown>
							</li>
						</ul>
					</div>
				</nav>
			</div>
		</div>
	);
};

export default Header;