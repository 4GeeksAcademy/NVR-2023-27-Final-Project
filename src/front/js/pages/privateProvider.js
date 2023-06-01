import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const PrivateProvider = () => {
    const { store, actions } = useContext(Context);

    const navigate = useNavigate();

    useEffect(() =>{
            const checkCredentials = () => {
                if (!localStorage.getItem("credentials")) { navigate("/")};
            };

            checkCredentials();
            actions.getServiceDescriptions();

    }, []);


    const handleClickHome = () => {
        navigate("/");
    }
    const handleSignout = () => {
        actions.signout();
        navigate("/");
    }
 
    return (
        <>  
            <div className="container-fluid">
                <header>
                    <p>Private Provider</p>
                    <p>{localStorage.getItem("credentials")}</p>
                    <button className="btn btn-primary mx-3" onClick={handleClickHome}>
                    Home
                    </button>
                    <button className="btn btn-primary mx-3" onClick={handleSignout}>
                    Sign Out
                    </button>
                </header>
                <main>
                    
                </main>
                <footer>

                </footer>
            </div>
        </>
    );
};