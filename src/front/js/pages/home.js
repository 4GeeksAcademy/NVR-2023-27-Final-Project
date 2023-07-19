import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

import { Carousel } from "../component/carousel "

export const Home = () => {
	const [userEmail, setUserEmail] = useState("");
	const [userPassword, setUserPassword] = useState("");
	const [providerEmail, setProviderEmail] = useState("");
	const [providerPassword, setProviderPassword] = useState("");

	const { store, actions } = useContext(Context);
	const navigate = useNavigate();


	const handleUserSignIn = async () => {
		if (await actions.signinUser(userEmail, userPassword)) {
			navigate("/privateUser");
		} else {
			console.log("Invalid username or password");
		}
	}

	const handleProviderSignIn = async () => {
		if (await actions.signinProvider(providerEmail, providerPassword)) {
			navigate("/privateProvider");
		} else {
			console.log("Invalid Provider username or password");
		}
	}

	const handleClickRegisterUser = () => {
		navigate("/registerUser");
	}

	const handleClickRegisterProvider = () => {
		navigate("/registerProvider");
	}

	return (

		<div
			className="mainWrapper container-fluid m-0 p-0 gx-0"
			style={{
				width: '100vw',
				height: '100vh',
				background: 'rgb(1, 36, 4)',
				color: 'blue',
				margin: 0,
				padding: 0,
				gap: 0,
				overflow: 'hidden',
				boxSizing: 'border-box',


			}}
		>
			<>

				{/* <button type="button" className="btn btn-primary mx-3" data-bs-toggle="modal" data-bs-target="#userModal">
					User Login
				</button> */}
				<div className="modal border-0 fade" id="userModal" tabIndex="-1">
					<div className="modal-dialog border-0 rounded-0">
						<div className="modal-content bg-danger rounded-o border-0">
							<div className="">
								<span className="modal-title">
									<div className="ms-2" style={{ display: "inline-block" }}>
										<svg width="18" height="18" viewBox="0 0 69 75" fill="none" xmlns="http://www.w3.org/2000/svg">
											<circle cx="34.5" cy="37.5" r="24" stroke="rgb(226, 224, 157)" strokeWidth="7" />
											<path d="M38.0449 42.7642C38.0449 42.3989 37.9912 42.0713 37.8838 41.7812C37.7764 41.4805 37.5776 41.2012 37.2876 40.9434C36.9976 40.6855 36.5786 40.4277 36.0308 40.1699C35.4937 39.9014 34.7847 39.6221 33.9038 39.332C32.8726 38.9883 31.8789 38.6016 30.9229 38.1719C29.9668 37.7314 29.1128 37.2212 28.3608 36.6411C27.6089 36.0503 27.0127 35.3628 26.5723 34.5786C26.1318 33.7837 25.9116 32.8599 25.9116 31.8071C25.9116 30.7974 26.1372 29.8896 26.5884 29.084C27.0396 28.2676 27.668 27.5747 28.4736 27.0054C29.29 26.4253 30.2461 25.9849 31.3418 25.6841C32.4375 25.3726 33.6353 25.2168 34.9351 25.2168C36.6538 25.2168 38.1685 25.5176 39.479 26.1191C40.8003 26.71 41.8315 27.5532 42.5728 28.6489C43.3247 29.7339 43.7007 31.0176 43.7007 32.5H38.0771C38.0771 31.9092 37.9536 31.3882 37.7065 30.937C37.4702 30.4858 37.1104 30.1313 36.627 29.8735C36.1436 29.6157 35.5366 29.4868 34.8062 29.4868C34.0972 29.4868 33.501 29.5942 33.0176 29.8091C32.5342 30.0239 32.1689 30.314 31.9219 30.6792C31.6748 31.0337 31.5513 31.4258 31.5513 31.8555C31.5513 32.21 31.6479 32.5322 31.8413 32.8223C32.0454 33.1016 32.3301 33.3647 32.6953 33.6118C33.0713 33.8589 33.5225 34.0952 34.0488 34.3208C34.5859 34.5464 35.1875 34.7666 35.8535 34.9814C37.0996 35.3789 38.2061 35.8247 39.1729 36.3188C40.1504 36.8022 40.9722 37.3555 41.6382 37.9785C42.3149 38.5908 42.8252 39.2891 43.1689 40.0732C43.5234 40.8574 43.7007 41.7437 43.7007 42.7319C43.7007 43.7847 43.4966 44.7192 43.0884 45.5356C42.6802 46.3521 42.0947 47.0449 41.332 47.6143C40.5693 48.1729 39.6562 48.5972 38.5928 48.8872C37.5293 49.1772 36.3423 49.3223 35.0317 49.3223C33.8286 49.3223 32.6416 49.1719 31.4707 48.8711C30.3105 48.5596 29.2578 48.0869 28.3125 47.4531C27.3672 46.8086 26.6099 45.9868 26.0405 44.9878C25.4819 43.978 25.2026 42.7803 25.2026 41.3945H30.8745C30.8745 42.082 30.9658 42.6621 31.1484 43.1348C31.3311 43.6074 31.5996 43.9888 31.9541 44.2788C32.3086 44.5581 32.7437 44.7622 33.2593 44.8911C33.7749 45.0093 34.3657 45.0684 35.0317 45.0684C35.7515 45.0684 36.3315 44.9663 36.772 44.7622C37.2124 44.5474 37.5347 44.2681 37.7388 43.9243C37.9429 43.5698 38.0449 43.1831 38.0449 42.7642Z" fill="rgb(226, 224, 157)" />
										</svg>
										<span className="ps-1 logoModal">
											Solutioner
										</span>
										<span className="loginLabel ms-1">
											login
										</span>
									</div>
								</span>
								<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
							</div>
							<div className="modal-body border-0">
								<div className="form-group">
									<label className="loginLabel">email address</label>
									<input type="email" className="form-control rounded-o inputLoginModal" placeholder="Enter email" onChange={(e) => {
										setUserEmail(e.target.value)
									}} />
								</div>
								<div className="form-group">
									<label className="loginLabel">password</label>
									<input type="password" className="form-control rounded-0 inputLoginModal" placeholder="Enter Password" onChange={(e) => {
										setUserPassword(e.target.value)
									}} />
								</div>
							</div>
							<div className="border-0">
								<button type="button" className="loginUserButton" data-bs-dismiss="modal" onClick={() => {
									handleUserSignIn();
								}} > login</button>
							</div>
						</div>
					</div>
				</div>
			</>
			<>
				{/* <button type="button" className="btn btn-primary mx-3" data-bs-toggle="modal" data-bs-target="#providerModal">
					Provider Login
				</button> */}
				<div className="modal fade" id="providerModal" tabIndex="-1" aria-hidden="true">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h1 className="modal-title fs-5" >Provider Login</h1>
								<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div className="modal-body">
								<div className="form-group">
									<label >Email address</label>
									<input type="email" className="form-control" placeholder="Enter email" onChange={(e) => {
										setProviderEmail(e.target.value)
									}} />
								</div>
								<div className="form-group">
									<label >Password</label>
									<input type="password" className="form-control" placeholder="Password" onChange={(e) => {
										setProviderPassword(e.target.value)
									}} />
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => {
									handleProviderSignIn();
								}}>Login</button>
							</div>
						</div>
					</div>
				</div>
			</>

			<div className="Header pt-3 d-flex align-items-center justify-content-between">
				<div className="logo" style={{ display: "inline-block" }}>
					<svg width="34.5" height="37.5" viewBox="0 0 69 75" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="34.5" cy="37.5" r="24" stroke="rgb(226, 224, 157)" strokeWidth="7" />
						<path d="M38.0449 42.7642C38.0449 42.3989 37.9912 42.0713 37.8838 41.7812C37.7764 41.4805 37.5776 41.2012 37.2876 40.9434C36.9976 40.6855 36.5786 40.4277 36.0308 40.1699C35.4937 39.9014 34.7847 39.6221 33.9038 39.332C32.8726 38.9883 31.8789 38.6016 30.9229 38.1719C29.9668 37.7314 29.1128 37.2212 28.3608 36.6411C27.6089 36.0503 27.0127 35.3628 26.5723 34.5786C26.1318 33.7837 25.9116 32.8599 25.9116 31.8071C25.9116 30.7974 26.1372 29.8896 26.5884 29.084C27.0396 28.2676 27.668 27.5747 28.4736 27.0054C29.29 26.4253 30.2461 25.9849 31.3418 25.6841C32.4375 25.3726 33.6353 25.2168 34.9351 25.2168C36.6538 25.2168 38.1685 25.5176 39.479 26.1191C40.8003 26.71 41.8315 27.5532 42.5728 28.6489C43.3247 29.7339 43.7007 31.0176 43.7007 32.5H38.0771C38.0771 31.9092 37.9536 31.3882 37.7065 30.937C37.4702 30.4858 37.1104 30.1313 36.627 29.8735C36.1436 29.6157 35.5366 29.4868 34.8062 29.4868C34.0972 29.4868 33.501 29.5942 33.0176 29.8091C32.5342 30.0239 32.1689 30.314 31.9219 30.6792C31.6748 31.0337 31.5513 31.4258 31.5513 31.8555C31.5513 32.21 31.6479 32.5322 31.8413 32.8223C32.0454 33.1016 32.3301 33.3647 32.6953 33.6118C33.0713 33.8589 33.5225 34.0952 34.0488 34.3208C34.5859 34.5464 35.1875 34.7666 35.8535 34.9814C37.0996 35.3789 38.2061 35.8247 39.1729 36.3188C40.1504 36.8022 40.9722 37.3555 41.6382 37.9785C42.3149 38.5908 42.8252 39.2891 43.1689 40.0732C43.5234 40.8574 43.7007 41.7437 43.7007 42.7319C43.7007 43.7847 43.4966 44.7192 43.0884 45.5356C42.6802 46.3521 42.0947 47.0449 41.332 47.6143C40.5693 48.1729 39.6562 48.5972 38.5928 48.8872C37.5293 49.1772 36.3423 49.3223 35.0317 49.3223C33.8286 49.3223 32.6416 49.1719 31.4707 48.8711C30.3105 48.5596 29.2578 48.0869 28.3125 47.4531C27.3672 46.8086 26.6099 45.9868 26.0405 44.9878C25.4819 43.978 25.2026 42.7803 25.2026 41.3945H30.8745C30.8745 42.082 30.9658 42.6621 31.1484 43.1348C31.3311 43.6074 31.5996 43.9888 31.9541 44.2788C32.3086 44.5581 32.7437 44.7622 33.2593 44.8911C33.7749 45.0093 34.3657 45.0684 35.0317 45.0684C35.7515 45.0684 36.3315 44.9663 36.772 44.7622C37.2124 44.5474 37.5347 44.2681 37.7388 43.9243C37.9429 43.5698 38.0449 43.1831 38.0449 42.7642Z" fill="rgb(226, 224, 157)" />
					</svg>
					<span className="ps-1">
						Solutioner
					</span>
				</div>
				<div className="buttons d-flex flex-row">
					<span>
						<button className="signinUserButton" data-bs-toggle="modal" data-bs-target="#userModal">sign in</button>

					</span>
					<span>
						<button className="registerUserButton me-4" onClick={handleClickRegisterUser}>register</button>
					</span>
				</div>
			</div>
			<div>
				<Carousel start={0} end={9} />
			</div>
			<div className="ms-5 mt-5 d-flex flex-row">
				<div>
					<span className="footerLink">
						Privacy Policy
					</span>
					<span className="footerLink">
						Cookies Policy
					</span>
					<span className="footerLink">
						Terms of Service
					</span>
					<span className="footerLink">
						Work with us
					</span>
					<span className="footerLink">
						info@solutioner.com
					</span>
					<span className="footerLink">
						©2023 Solutioner Systems. All Rights reserved.
					</span>
				</div>
				<div className="providerButtonsWrapper">
					<span >
						<button className="providerHoemButton" data-bs-toggle="modal" data-bs-target="#providerModal"> provider sign-in</button>
					</span>
					<span>
						<button className="providerHoemButton" onClick={handleClickRegisterProvider}>provider register</button>
					</span>
				</div>
			</div>

		</div>

	);
};
