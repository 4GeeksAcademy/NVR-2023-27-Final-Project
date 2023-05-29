import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const PrivateUser = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const handleClickHome = () => {
        navigate("/");
    }
 
    return (
        <>
            <p>Private user</p>
            <button className="btn btn-primary mx-3" onClick={handleClickHome}>
            Home
            </button>
        </>
    );
};