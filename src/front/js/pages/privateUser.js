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
                    {/* side banner  */}
                    <button
                        className="btn btn-primary"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasScrolling"
                        aria-controls="offcanvasScrolling"
                    > 123
                    </button>
                    <div
                        className="offcanvas offcanvas-end sideBanner"
                        data-bs-scroll="true"
                        data-bs-backdrop="false"
                        tabIndex={-1}
                        id="offcanvasScrolling"
                        aria-labelledby="offcanvasScrollingLabel"
                    >
                        <span
                            type="button"
                            className="dimissBanner ps-3 pt-3"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="15.12" viewBox="0 -302.4 302.4 302.4" width="15.12">
                                <path d="m176.715-76.23-13.545-13.23 52.92-52.92H50.4v-18.9h165.555L154.215-214.23l13.545-13.23 76.23 76.23-76.23 76.23Z" />
                            </svg>
                        </span>
                        {/* side banner ACCORDION */}
                        <div className="offcanvas-body">
                            <div className="accordion accordion-flush" id="accordionFlushExample">
                                <div className="accordion-item">
                                    <span
                                        className="accordion-button collapsed settingsLabel"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseOne"
                                        aria-expanded="false"
                                        aria-controls="flush-collapseOne"
                                    >
                                        service preferences
                                    </span>
                                    <div
                                        id="flush-collapseOne"
                                        className="accordion-collapse collapse"
                                        data-bs-parent="#accordionFlushExample"
                                    >
                                        <div className="accordion-body mx-auto">
                                            Placeholder content for this accordion, which is intended to demonstrate
                                            the <code>.accordion-flush</code> class. This is the first item's
                                            accordion body.
                                        </div>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="accordion-item">
                                    <span
                                        className="accordion-button collapsed settingsLabel"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseTwo"
                                        aria-expanded="false"
                                        aria-controls="flush-collapseTwo"
                                    >
                                        account details
                                    </span>
                                    <div
                                        id="flush-collapseTwo"
                                        className="accordion-collapse collapse"
                                        data-bs-parent="#accordionFlushExample"
                                    >
                                        <div className="accordion-body">
                                            Placeholder content for this accordion, which is intended to demonstrate
                                            the <code>.accordion-flush</code> class. This is the first item's
                                            accordion body.
                                        </div>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="accordion-item">
                                    <span
                                        className="accordion-button collapsed settingsLabel"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseTwo"
                                        aria-expanded="false"
                                        aria-controls="flush-collapseTwo"
                                    >
                                        account details
                                    </span>
                                    <span>
                                    </span>
                                    <div
                                        id="flush-collapseTwo"
                                        className="accordion-collapse collapse"
                                        data-bs-parent="#accordionFlushExample"
                                    >
                                        <div className="accordion-body">
                                            Placeholder content for this accordion, which is intended to demonstrate
                                            the <code>.accordion-flush</code> class. This is the second item's
                                            accordion body. Let's imagine this being filled with some actual
                                            content.
                                        </div>
                                    </div>
                                </div>
                                <hr></hr>

                                <div className="accordion-item">
                                    <span
                                        className="accordion-button collapsed settingsLabel"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseThree"
                                        aria-expanded="false"
                                        aria-controls="flush-collapseThree"
                                    >
                                        credit card info
                                    </span>
                                    <div
                                        id="flush-collapseThree"
                                        className="accordion-collapse collapse"
                                        data-bs-parent="#accordionFlushExample"
                                    >
                                        <div className="accordion-body">
                                            Placeholder content for this accordion, which is intended to demonstrate
                                            the <code>.accordion-flush</code> class. This is the third item's
                                            accordion body. Nothing more exciting happening here in terms of
                                            content, but just filling up the space to make it look, at least at
                                            first glance, a bit more representative of how this would look in a
                                            real-world application.
                                        </div>
                                    </div>
                                    <hr></hr>
                                </div>
                            </div>

                        </div>
                    </div>
                </header>
                <main>
                    <div className="mainWrapper">
                        <div className="menu d-flex justify-content-center">
                            <button
                                className={`menuLabel ${selectedSection === "requestService" ? "selectedSectionButton active" : ""}`}
                                onClick={() => handleSectionClick("requestService")}
                            ><span>request service</span></button>
                            <button
                                className={`menuLabel ${selectedSection === "myRequests" ? "selectedSectionButton active" : ""}`}
                                onClick={() => handleSectionClick("myRequests")}
                            ><span>my requests</span></button>
                            <button
                                className={`menuLabel ${selectedSection === "notifications" ? "selectedSectionButton active" : ""}`}
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