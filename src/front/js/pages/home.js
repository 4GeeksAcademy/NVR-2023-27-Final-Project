import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const handleClickRegister = () => {
		navigate("/registerUser");
	}

	return (
		<>
			<p>Home</p>
			<button className="btn btn-primary mx-3">
			Sign in
			</button>
			<button className="btn btn-success mx-3" onClick={handleClickRegister}>
			Register
			</button>
		</>
	);
};
