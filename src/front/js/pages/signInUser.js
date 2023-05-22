import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const SignInUser = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { store, actions } = useContext(Context);
    const navigate = useNavigate();


    const signinUser = async() => {
        
        if(await actions.signinUser(email, password)){
            navigate("/privateUser");
        }
        
    }

    return (
        <div className="container col-4">
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => {
                        setEmail(e.target.value)
                    }} />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" onChange={(e) => {
                        setPassword(e.target.value)
                    }} />
                </div>
                <button className="btn btn-primary" onClick={() => {
                    console.log("I am here");
                   signinUser();
                }}>Sign In</button>
        </div>
    );
};