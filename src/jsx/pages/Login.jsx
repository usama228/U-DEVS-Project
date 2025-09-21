import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import {
	loadingToggleAction, loginAction,
} from '../../store/actions/AuthActions';

// image

import BgImage from "../../assets/images/bg1.png";
import logo from "../../assets/images/logo-full.png";
import logolight from "../../assets/images/logo-white.png";
import pol from "../../assets/images/pol.jpg";

function Login(props) {
	const [email, setEmail] = useState('');
	let errorsObj = { email: '', password: '' };
	const [errors, setErrors] = useState(errorsObj);
	const [password, setPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Ensure fields are empty on component mount
	useEffect(() => {
		setEmail('');
		setPassword('');
		// Force clear any cached values
		const emailInput = document.querySelector('input[type="email"]');
		const passwordInput = document.querySelector('input[type="password"]');
		if (emailInput) emailInput.value = '';
		if (passwordInput) passwordInput.value = '';
	}, []);

	function onLogin(e) {
		e.preventDefault();
		
		if (isSubmitting) {
			return;
		}
		
		let error = false;
		const errorObj = { ...errorsObj };
		if (email === '') {
			errorObj.email = 'Email is Required';
			error = true;
		}
		if (password === '') {
			errorObj.password = 'Password is Required';
			error = true;
		}
		setErrors(errorObj);
		if (error) {
			return;
		}
		
		setIsSubmitting(true);
		dispatch(loadingToggleAction(true));
		dispatch(loginAction(email, password, navigate));
		
		// Reset submitting state after a delay
		setTimeout(() => setIsSubmitting(false), 3000);
	}

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const element = document.querySelector("body");
	let dataTheme = element?.getAttribute("data-theme-version") || "light";

	return (
		<div className="container h-100">
			<div className="row h-100 align-items-center justify-contain-center">
				<div className="col-xl-12">
					<div className="card">
						<div className="card-body p-0">
							<div className="row m-0">
								<div className="col-xl-6 col-md-6 sign text-center sign-bg" style={{ backgroundImage: 'url(' + pol + ')' }}>
									<div>
										<div className="text-center my-5">
											<Link to={"#"}>
												<img className="logo-abbr dark-logo" width="200" src={logo} alt="" />
												<img className="logo-abbr light-logo text-center m-auto" width="200" src={logolight} alt="" />
											</Link>
										</div>
										{
											dataTheme === "light" ?
												<img src={BgImage} className="slideskew img-fix bitcoin-img" alt="Background" />
												:
												<img src={BgImage} className=" slideskew img-fix bitcoin-img " alt="Background" />
										}
									</div>
								</div>
								<div className="col-xl-6 col-md-6" >
									<div className="sign-in-your px-2">
										<h4 className="fs-20 ">Internship Management System</h4>
										<span>Welcome back! Please login with your credentials</span>

										{props.errorMessage && (
											<div className='bg-red-300 text-red-900 border border-red-900 p-1 my-2'>
												{props.errorMessage}
											</div>
										)}
										{props.successMessage && (
											<div className='bg-green-300 text-green-900 border border-green-900 p-1 my-2'>
												{props.successMessage}
											</div>
										)}
										<form onSubmit={onLogin} autoComplete="off">
											<div className="mb-3">
												<label className="mb-1"><strong>Email</strong><span className='required'>*</span></label>
												<input 
													type="email" 
													className="form-control"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													placeholder="your@example.com"
													autoComplete="new-email"
													autoCorrect="off"
													autoCapitalize="off"
													spellCheck="false"
												/>

												{errors.email && <div className="text-danger fs-12">{errors.email}</div>}
											</div>
											<div className="mb-3 position-relative">
												<label className="mb-1"><strong>Password</strong><span className='required'>*</span></label>
												<input
													type={showPassword ? 'text' : 'password'}
													className="form-control"
													value={password}
													placeholder="••••••••"
													onChange={(e) => setPassword(e.target.value)}
													autoComplete="new-password"
													autoCorrect="off"
													autoCapitalize="off"
													spellCheck="false"
												/>
												<span className="position-absolute end-0 translate-middle-y"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{
                                                    cursor: "pointer",
                                                    paddingRight: "0.75rem",
                                                    transform: "translateY(-50%)",
                                                    paddingBottom: "2.5rem"
                                                    }}>
                                                    <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                                </span>
												{errors.password && <div className="text-danger fs-12">{errors.password}</div>}
											</div>
											<div className="row d-flex justify-content-between mt-4 mb-2">
												<div className="mb-3">
													<div className="form-check custom-checkbox ms-1">
														<input type="checkbox" className="form-check-input" id="basic_checkbox_1" />
														<label className="form-check-label" htmlFor="basic_checkbox_1">Remember me</label>
													</div>
												</div>

											</div>
											<div className="text-center">
												<button 
													type="submit" 
													className="btn btn-primary btn-block"
													disabled={isSubmitting || props.showLoading}
												>
													{isSubmitting || props.showLoading ? (
														<>
															<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
															Signing In...
														</>
													) : (
														'Sign Me In'
													)}
												</button>
											</div>

										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		errorMessage: state.auth.errorMessage,
		successMessage: state.auth.successMessage,
		showLoading: state.auth.showLoading,
	};
};
export default connect(mapStateToProps)(Login);
