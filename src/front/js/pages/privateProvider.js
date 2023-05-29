import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const PrivateProvider = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const handleClickHome = () => {
        navigate("/");
    }

    const signout = () => {
        actions.signout();
        navigate("/");
    }
 
    return (
        <>
            <p>Private Provider</p>
            <button className="btn btn-primary mx-3" onClick={handleClickHome}>
                Home
            </button>
            <button className="btn btn-primary mx-3" onClick={signout}>
            Sign Out
            </button>

        </>
    );
};