import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const Home = () => {
	const [userEmail, setUserEmail] = useState("");
	const [userPassword, setUserPassword] = useState("");
	const [providerEmail, setProviderEmail] = useState("");
	const [providerPassword, setProviderPassword] = useState("");

	const { store, actions } = useContext(Context);
	const navigate = useNavigate();


	const handleClickUserSignIn = async () => {
		if (await actions.signinUser(userEmail, userPassword)) {
			navigate("/privateUser");
		}else{
			console.log("Invalid username or password");
		}
	}

	const handleClickProviderSignIn = async () => {
		if (await actions.signinProvider(providerEmail, providerPassword)) {
			navigate("/privateProvider");
		}else{
			console.log("Invalid username or password");
		}
	}

	const handleClickRegisterUser = () => {
		navigate("/registerUser");
	}

	const handleClickRegisterProvider = () => {
		navigate("/registerProvider");
	}

	return (
		<>
			<p>Home</p>
			<>
				<button type="button" className="btn btn-primary mx-3" data-bs-toggle="modal" data-bs-target="#userModal">
					User Login
				</button>
				<div className="modal fade" id="userModal" tabIndex="-1">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h1 className="modal-title fs-5">User Login</h1>
								<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
							</div>
							<div className="modal-body">
								<div className="form-group">
									<label>Email address</label>
									<input type="email" className="form-control" placeholder="Enter email" onChange={(e) => {
										setUserEmail(e.target.value)
									}} />
								</div>
								<div className="form-group">
									<label >Password</label>
									<input type="password" className="form-control" placeholder="Password" onChange={(e) => {
										setUserPassword(e.target.value)
									}} />
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => {
									handleClickUserSignIn();
								}} > Login</button>
							</div>
						</div>
					</div>
				</div>
			</>
			<>
				<button type="button" className="btn btn-primary mx-3" data-bs-toggle="modal" data-bs-target="#providerModal">
					Provider Login
				</button>
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
									handleClickProviderSignIn();
								}}>Login</button>
							</div>
						</div>
					</div>
				</div>
			</>
			<button className="btn btn-success mx-3" onClick={handleClickRegisterUser}>
			User Register
			</button>
			<button className="btn btn-success mx-3" onClick={handleClickRegisterProvider}>
			Provider Register
			</button>
		</>
	);
};
