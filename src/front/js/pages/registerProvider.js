import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const RegisterProvider = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const handleClickHome = () => {
        navigate("/");
    }
    const handleClickPrivate = () => {
        navigate("/privateProvider");
    }
 
    return (
        <>
            <p>Register Provider</p>
            <button className="btn btn-primary" onClick={handleClickHome}>
            Home
            </button>
            <button className="btn btn-success mx-3" onClick={handleClickPrivate}>
            Private
            </button>
        </>
    );
};