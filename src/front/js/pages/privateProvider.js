import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const PrivateProvider = () => {
    const { store, actions } = useContext(Context);

    const navigate = useNavigate();


    // useEffects 

   
    useEffect(() => {
        const checkCredentials = () => {
            if (!localStorage.getItem("credentials")) {
                navigate("/");
            }
        };

        checkCredentials();
        
        if (localStorage.getItem("credentials")) {

            // Generates Welcome message from name
            let nameString = JSON.parse(localStorage.getItem("credentials")).name.toLowerCase();
            if (nameString.length > 10) {
                let auxiliaryNameArray = nameString.split(" ");
                if (auxiliaryNameArray[0].length > 10) {
                    nameString = auxiliaryNameArray[0][0] + (auxiliaryNameArray[1] ? auxiliaryNameArray[1][0] : "");
                } else {
                    nameString = auxiliaryNameArray[0];
                }
            }

            nameString = "welcome back, " + nameString;
            actions.alertUser(nameString, "yellow", "black");


            actions.getProviderAcceptedRequests();
            actions.getProviderProvidedServices();
            actions.getProviderAvailabities();
            actions.getProviderNotifications();
            actions.getProviderSettings();

            actions.getServiceDescriptions();

        }
}, []);




    // handle Functions

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