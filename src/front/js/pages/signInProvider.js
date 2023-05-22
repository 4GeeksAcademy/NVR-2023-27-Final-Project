import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const SignInProvider = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const signinProvider = async () => {
        if (await actions.signinProvider(email, password)){
            navigate("/privateProvider");
        }
    }

    return (
        <div className="container col-4">
            <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => {
                    setEmail(e.target.value)
                }} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password" onChange={(e) => {
                    setPassword(e.target.value)
                }} />
            </div>
            <button className="btn btn-primary" onClick={() => {
                console.log("sign in clicked for provider");
                signinProvider();
            }}>Sign In</button>
        </div>
    );
};