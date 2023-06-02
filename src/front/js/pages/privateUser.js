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
                            className="dimissBAnner"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        >Dismiss</span>
                        <div className="offcanvas-body vw-100 px-0 mx-0 gx-0">
                            {/* side banner ACCORDION */}
                            <div className="accordion accordion-flush vw-50" id="accordionFlushExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <span
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#flush-collapseOne"
                                            aria-expanded="false"
                                            aria-controls="flush-collapseOne"
                                        >
                                            Accordion Item #1
                                        </span>
                                    </h2>
                                    <div
                                        id="flush-collapseOne"
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
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <span
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#flush-collapseTwo"
                                            aria-expanded="false"
                                            aria-controls="flush-collapseTwo"
                                        >
                                            Accordion Item #2
                                        </span>
                                    </h2>
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
                                <div className="accordion-item">
                                    <h2 className="">
                                        <span
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#flush-collapseThree"
                                            aria-expanded="false"
                                            aria-controls="flush-collapseThree"
                                        >
                                            Accordion Item #3
                                        </span>
                                    </h2>
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
                                </div>
                            </div>

                        </div>
                    </div>
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