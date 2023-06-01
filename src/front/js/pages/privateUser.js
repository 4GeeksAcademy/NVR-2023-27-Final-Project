import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/privateuser.css";

export const PrivateUser = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState("requestService");


    useEffect(() => {
        const checkCredentials = () => {
            if (!localStorage.getItem("credentials")) { navigate("/") };
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

    const handleSectionClick = (section) => {
        setSelectedSection(section)
    }
    return (
        <>
            <div className="container-fluid">
                <header>
                    <p>Private User</p>
                    <p>{localStorage.getItem("credentials")}</p>
                    <button className="btn btn-primary mx-3" onClick={handleClickHome}>
                        Home
                    </button>
                    <button className="btn btn-primary mx-3" onClick={handleSignout}>
                        Sign Out
                    </button>
                </header>
                <main>
                    <div className="mainWrapper">
                        <div className="menu d-flex justify-content-center">
                            <button
                                className={`menu-button ${selectedSection === "requestService" ? "selectedSectionButton active" : ""}`}
                                onClick={() => handleSectionClick("requestService")}
                            ><span>request service</span></button>
                            <button
                                className={`menu-button ${selectedSection === "myRequests" ? "selectedSectionButton active" : ""}`}
                                onClick={() => handleSectionClick("myRequests")}
                            ><span>my requests</span></button>
                            <button
                                className={`menu-button ${selectedSection === "notifications" ? "selectedSectionButton active" : ""}`}
                                onClick={() => handleSectionClick("notifications")}
                            ><span>notifications</span></button>
                        </div>
                        <div className="content">
                            {selectedSection === 'requestService' && (
                                <div>
                                    <h2>Request a service</h2>
                                    {/* Content of the "Request a service" section */}
                                </div>
                            )}
                            {selectedSection === 'myRequests' && (
                                <div>
                                    <h2>My requests</h2>
                                    {/* Content of the "My requests" section */}
                                </div>
                            )}
                            {selectedSection === 'notifications' && (
                                <div>
                                    <h2>Notifications</h2>
                                    {/* Content of the "Notifications" section */}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                <footer>

                </footer>
            </div>
        </>
    );
};