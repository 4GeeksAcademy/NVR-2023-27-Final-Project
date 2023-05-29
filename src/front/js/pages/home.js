import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const handleClickRegisterUser = () => {
		navigate("/registerUser");
	}

	const handleClickRegisterProvider = () => {
		navigate("/registerProvider");
	}


	return (
		<>
			<p>Home</p>
			<button className="btn btn-primary mx-3">
			User Sign in 
			</button>
			<button className="btn btn-primary mx-3">
			Provider Sign in 
			</button>
			<button className="btn btn-success mx-3" onClick={handleClickRegisterUser}>
			User Register
			</button>
			<button className="btn btn-success mx-3" onClick={handleClickRegisterProvider}>
			Provider Register
			</button>
		</>
	);
};
