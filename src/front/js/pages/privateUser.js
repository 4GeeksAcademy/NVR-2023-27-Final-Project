import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

import { ServiceRollUp } from "../component/serviceRollUp";
import { RequestRollUp } from "../component/requestRollUp"
import { NotificationRollUp } from "../component/notificationRollUp";
import { UserServiceSettings } from "../component/userserviceSettings";

import "../../styles/privateuser.css";

export const PrivateUser = () => {

    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState("requestService");

    // Generate initials for Avatar

    const getAvatarInitials = (name) => {
        let avatarInitials = "";

        if (name) {
            const words = name.split(" ");
            const firstWord = words[0];
            const secondWord = words[1];
            avatarInitials += firstWord ? firstWord.charAt(0) : "";
            avatarInitials += secondWord ? secondWord.charAt(0) : (firstWord && firstWord.length > 1) ? firstWord.charAt(1) : "";
        }

        return avatarInitials.toLowerCase();
    };

    const avatarInitials = localStorage.getItem("credentials") ? getAvatarInitials(JSON.parse(localStorage.getItem("credentials")).name) : "";

    // Filter variables

    // Srevices

    const [selectedServiceCategory, setSelectedServiceCategory] = useState("Any category");
    const [selectedServicePrice, setSelectedServicePrice] = useState("Any price");
    const [serviceSearchBar, setServiceSearchBar] = useState("");

    const [serviceCategories, setServiceCategories] = useState([]);
    const [servicePrices, setServicePrices] = useState({});

    let filteredServices = null;

    // Requests

    const [filteredRequests, setFilteredRequests] = useState([]);

    const [selectedSortRequestsBy, setSelectedSortRequeststBy] = useState("Newest")
    const [selectedFilterRequestsBy, setSelectedFilterRequestsBy] = useState("All requests")
    const [requestsSearchBar, setRequestsSearchBar] = useState("");

    const statusMap = new Map([
        ["Expired", 0],
        ["Requested", 1],
        ["Taken", 2],
        ["Safeguarded", 3],
        ["Provided", 4],
        ["Renewed", 5],
        ["Reviewed", 6],
        ["Completed", 7],
        ["Sanctioned", 8]
    ]);

    // Notifications

    const [filteredNotifications, setFilteredNotifications] = useState([]);

    const [selectedSortNotificationsBy, setSelectedSortNotificationsBy] = useState("Newest")
    const [selectedFilterNotificationsBy, setSelectedFilterNotificationsBy] = useState("All notifications")
    const [notificationsSearchBar, setNotificationsSearchBar] = useState("");

    const typeOfNotificationMap = new Map([
        ["Acceptances", 1],
        ["Cancellations", 2],
        ["Promotional", 3],
        ["Support", 4],

    ])


    // UseEffects

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

            actions.getUserSettings();
            actions.getUserAddresses();
            actions.getUserExclusions();
            actions.getUserRequests();
            actions.getUserBookedDays();
            actions.getUserNotifications();
            actions.getServiceDescriptions();

        }
    }, []);

    useEffect(() => {
        const findPriceIntervals = () => {
            if (store.serviceDescriptions.length === 0) {
                return null;
            }

            const prices = store.serviceDescriptions.map((item) => item.price);
            const lowestPrice = Math.min(...prices);
            const highestPrice = Math.max(...prices);

            const intervalRange = (highestPrice - lowestPrice) / 3;

            const intervals = {
                interval1Min: Math.ceil(lowestPrice),
                interval1Max: Math.ceil(lowestPrice + intervalRange),
                interval2Min: Math.ceil(lowestPrice + intervalRange),
                interval2Max: Math.ceil(lowestPrice + intervalRange * 2),
                interval3Min: Math.ceil(lowestPrice + intervalRange * 2),
                interval3Max: Math.ceil(highestPrice),
            };

            return intervals;
        };

        if (store.serviceDescriptions) {
            const newCategories = ["Any category", ...new Set(store.serviceDescriptions.map((service) => service.category))].sort();
            setServiceCategories(newCategories);

            const updatedPrices = findPriceIntervals();
            setServicePrices(updatedPrices);
        }

    }, [store.serviceDescriptions]);


    // Requests Sort and Filter

    useEffect(() => {
        if (selectedSection !== "myRequests") {
            return;
        }

        // Filter userRequests
        let filteredRequests = store.userRequests.filter((request) => {
            // Filter by status
            if (selectedFilterRequestsBy !== "All requests" && request.status !== statusMap.get(selectedFilterRequestsBy)) {
                return false;
            }

            // Filter by search bar content
            if (requestsSearchBar.trim() !== "") {
                const searchTerm = requestsSearchBar.toLowerCase();
                const requestedServiceName =
                    store.serviceDescriptions && store.serviceDescriptions.find((item) => item.id === request.service_description_id).service;

                if (requestedServiceName && !requestedServiceName.toLowerCase().includes(searchTerm)) {
                    return false;
                }
            }
            return true;
        });


        // Sort by specified method
        switch (selectedSortRequestsBy) {
            case "Oldest":
                filteredRequests.sort(function (firstRequest, secondRequest) {
                    const dateFirstRequest = new Date(firstRequest.date);
                    const dateSecondRequest = new Date(secondRequest.date);
                    return dateFirstRequest - dateSecondRequest;
                });
                break;

            case "Newest":
                filteredRequests.sort(function (firstRequest, secondRequest) {
                    const dateFirstRequest = new Date(firstRequest.date);
                    const dateSecondRequest = new Date(secondRequest.date);
                    return dateSecondRequest - dateFirstRequest;
                });
                break;

            case "More expensive":
                if (store.serviceDescriptions && store.userRequests) {
                    filteredRequests.sort((firstRequest, secondRequest) => {
                        const serviceDescriptionId = firstRequest.service_description_id;
                        const priceFirstRequest =
                            store.serviceDescriptions.find((service) => service.id === serviceDescriptionId).price * firstRequest.quantity;

                        const serviceDescriptionId2 = secondRequest.service_description_id;
                        const priceSecondRequest =
                            store.serviceDescriptions.find((service) => service.id === serviceDescriptionId2).price * secondRequest.quantity;

                        return priceSecondRequest - priceFirstRequest;
                    });
                }
                break;

            case "More affordable":
                if (store.serviceDescriptions && store.userRequests) {
                    filteredRequests.sort((firstRequest, secondRequest) => {
                        const serviceDescriptionId = firstRequest.service_description_id;
                        const priceFirstRequest =
                            store.serviceDescriptions.find((service) => service.id === serviceDescriptionId).price * firstRequest.quantity;

                        const serviceDescriptionId2 = secondRequest.service_description_id;
                        const priceSecondRequest =
                            store.serviceDescriptions.find((service) => service.id === serviceDescriptionId2).price * secondRequest.quantity;

                        return priceFirstRequest - priceSecondRequest;
                    });
                }
                break;

        }

        setFilteredRequests(filteredRequests);
    }, [selectedSortRequestsBy, selectedFilterRequestsBy, requestsSearchBar, selectedSection, store.userRequests, store.serviceDescriptions]);


    // Notifications Sort and Filter

    useEffect(() => {
        if (selectedSection !== "notifications") {
            return;
        }

        // Filter userNotifications
        let filteredNotifications = store.userNotifications.filter((notification) => {
            // Filter by status
            if (selectedFilterNotificationsBy !== "All notifications" && notification.type_of_notification !== typeOfNotificationMap.get(selectedFilterNotificationsBy)) {
                return false;
            }

            // Filter by search bar content
            if (notificationsSearchBar.trim() !== "") {
                const searchTerm = notificationsSearchBar.toLowerCase();
                if (!notification.message.toLowerCase().includes(searchTerm)) {
                    return false;
                }
            }
            return true;
        });

        // Sort by specified method
        switch (selectedSortNotificationsBy) {
            case "Oldest":
                filteredNotifications.sort(function (firstNotification, secondNotification) {
                    return new Date(firstNotification.publishing_date_time) - new Date(secondNotification.publishing_date_time);
                });
                break;

            case "Newest":
                filteredNotifications.sort(function (firstNotification, secondNotification) {
                    return new Date(secondNotification.publishing_date_time) - new Date(firstNotification.publishing_date_time);
                    ;
                });
                break;
        }

        setFilteredNotifications(filteredNotifications);
    }, [selectedSortNotificationsBy, selectedFilterNotificationsBy, notificationsSearchBar, selectedSection, store.userNotifications]);


    // UI handle variable and functions

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

    // Services
    const handleServiceCategorySelect = (category) => {
        setSelectedServiceCategory(category);
        setServiceSearchBar("");
    };

    const handleServicePriceSelect = (price) => {
        setSelectedServicePrice(price);
        setServiceSearchBar("");
    };

    const handleChangeServiceSearchBar = (event) => {
        setServiceSearchBar(event.target.value);
    };

    //Requests

    const handleClickSortRequestsBy = (sortBy) => {
        setSelectedSortRequeststBy(sortBy);
    }

    const handleClickFilterRequestsBy = (filterBy) => {
        setSelectedFilterRequestsBy(filterBy);

    }

    const handleChangeRequestsSearchBar = (event) => {
        setRequestsSearchBar(event.target.value);
    };


    //Notifications

    const handleClickSortNotificationsBy = (sortBy) => {
        setSelectedSortNotificationsBy(sortBy);
    }

    const handleClickFilterNotificationsBy = (filterBy) => {
        setSelectedFilterNotificationsBy(filterBy);

    }

    const handleChangeNotificationsSearchBar = (event) => {
        setNotificationsSearchBar(event.target.value);
    };


    // Section initialization

    // Requst Service filtering and sorting
    if (selectedSection === "requestService") {

        if (store.serviceDescriptions) {
            filteredServices = store.serviceDescriptions.filter((service) => {
                // Filter by category
                if (selectedServiceCategory !== "Any category" && service.category !== selectedServiceCategory) {
                    return false;
                }

                // Filter by price
                if (selectedServicePrice !== "Any price") {
                    const price = parseFloat(service.price);

                    if (
                        (selectedServicePrice === `${servicePrices.interval1Min}€ - ${servicePrices.interval1Max}€` && (price < servicePrices.interval1Min || price > servicePrices.interval1Max)) ||
                        (selectedServicePrice === `${servicePrices.interval2Min}€ - ${servicePrices.interval2Max}€` && (price < servicePrices.interval2Min || price > servicePrices.interval2Max)) ||
                        (selectedServicePrice === `${servicePrices.interval3Min}€ - ${servicePrices.interval3Max}€` && (price < servicePrices.interval3Min || price > servicePrices.interval3Max))
                    ) {
                        return false;
                    }
                }

                // Filter by search bar content
                if (serviceSearchBar.trim() !== "") {
                    const searchTerm = serviceSearchBar.toLowerCase();

                    if (
                        !service.category.toLowerCase().includes(searchTerm) &&
                        !service.service.toLowerCase().includes(searchTerm) &&
                        !service.description.toLowerCase().includes(searchTerm)
                    ) {
                        return false;
                    }
                }
                return true;
            });

            // Sort filtered service alphabetcially, by Service and Category
            filteredServices.sort((firstService, secondService) => {
                const categoryComparison = firstService.category.localeCompare(secondService.category);
                if (categoryComparison === 0) {
                    return firstService.service.localeCompare(secondService.service);
                }
                return categoryComparison;
            });
        };
    }


    // Main JSX
    return (
        <>
            <div className="container-fluid mx-0 px-0 gx-0">
                <header>
                    {/* first Navbar */}
                    <nav className="navbar fixed-top px-3 firstBavBar">
                        <button onClick={() => handleSectionClick("home")}>
                            <div className="logoWrapper">
                                <span>
                                    <svg width="34.5" height="37.5" viewBox="0 0 69 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="34.5" cy="37.5" r="24" stroke="rgb(0, 70, 0)" strokeWidth="7" />
                                        <path d="M38.0449 42.7642C38.0449 42.3989 37.9912 42.0713 37.8838 41.7812C37.7764 41.4805 37.5776 41.2012 37.2876 40.9434C36.9976 40.6855 36.5786 40.4277 36.0308 40.1699C35.4937 39.9014 34.7847 39.6221 33.9038 39.332C32.8726 38.9883 31.8789 38.6016 30.9229 38.1719C29.9668 37.7314 29.1128 37.2212 28.3608 36.6411C27.6089 36.0503 27.0127 35.3628 26.5723 34.5786C26.1318 33.7837 25.9116 32.8599 25.9116 31.8071C25.9116 30.7974 26.1372 29.8896 26.5884 29.084C27.0396 28.2676 27.668 27.5747 28.4736 27.0054C29.29 26.4253 30.2461 25.9849 31.3418 25.6841C32.4375 25.3726 33.6353 25.2168 34.9351 25.2168C36.6538 25.2168 38.1685 25.5176 39.479 26.1191C40.8003 26.71 41.8315 27.5532 42.5728 28.6489C43.3247 29.7339 43.7007 31.0176 43.7007 32.5H38.0771C38.0771 31.9092 37.9536 31.3882 37.7065 30.937C37.4702 30.4858 37.1104 30.1313 36.627 29.8735C36.1436 29.6157 35.5366 29.4868 34.8062 29.4868C34.0972 29.4868 33.501 29.5942 33.0176 29.8091C32.5342 30.0239 32.1689 30.314 31.9219 30.6792C31.6748 31.0337 31.5513 31.4258 31.5513 31.8555C31.5513 32.21 31.6479 32.5322 31.8413 32.8223C32.0454 33.1016 32.3301 33.3647 32.6953 33.6118C33.0713 33.8589 33.5225 34.0952 34.0488 34.3208C34.5859 34.5464 35.1875 34.7666 35.8535 34.9814C37.0996 35.3789 38.2061 35.8247 39.1729 36.3188C40.1504 36.8022 40.9722 37.3555 41.6382 37.9785C42.3149 38.5908 42.8252 39.2891 43.1689 40.0732C43.5234 40.8574 43.7007 41.7437 43.7007 42.7319C43.7007 43.7847 43.4966 44.7192 43.0884 45.5356C42.6802 46.3521 42.0947 47.0449 41.332 47.6143C40.5693 48.1729 39.6562 48.5972 38.5928 48.8872C37.5293 49.1772 36.3423 49.3223 35.0317 49.3223C33.8286 49.3223 32.6416 49.1719 31.4707 48.8711C30.3105 48.5596 29.2578 48.0869 28.3125 47.4531C27.3672 46.8086 26.6099 45.9868 26.0405 44.9878C25.4819 43.978 25.2026 42.7803 25.2026 41.3945H30.8745C30.8745 42.082 30.9658 42.6621 31.1484 43.1348C31.3311 43.6074 31.5996 43.9888 31.9541 44.2788C32.3086 44.5581 32.7437 44.7622 33.2593 44.8911C33.7749 45.0093 34.3657 45.0684 35.0317 45.0684C35.7515 45.0684 36.3315 44.9663 36.772 44.7622C37.2124 44.5474 37.5347 44.2681 37.7388 43.9243C37.9429 43.5698 38.0449 43.1831 38.0449 42.7642Z" fill="rgb(0, 70, 0)" />
                                    </svg>
                                </span>
                                <span className="logoAnimation">
                                    Solutioner
                                </span>
                            </div>
                        </button>
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
                        ><span className="">notifications</span></button>

                        {/* Avatar Initials */}
                        <button
                            className="avatarButton"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasScrolling"
                            aria-controls="offcanvasScrolling"
                        >
                            <span className="avatarInitialsInnerWrapper">{avatarInitials}</span>
                        </button>
                        {/* Offcanvas */}
                        {/* Offcanvas ACCORDION */}
                        <div className="offcanvas offcanvas-end sideBanner"
                            data-bs-scroll="true"
                            data-bs-backdrop="false"
                            tabIndex={-1}
                            id="offcanvasScrolling"
                            aria-labelledby="offcanvasScrollingLabel"
                        >
                            <div className="d-flex justify-content-end closeSignOutButtonsWrapper">
                                <span
                                    className="settingsLabel borderRight closeSettingsButton"
                                    data-bs-dismiss="offcanvas"
                                    aria-label="Close"
                                >
                                    close
                                </span>
                                <button className="settingsLabel" onClick={handleSignout}>
                                    sign out
                                </button>
                            </div>
                            <div className="offcanvas-body offcanvasBody">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header d-flex flex-row">
                                            <span
                                                className="collapsed settingsLabel"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#flush-collapseOne"

                                                aria-expanded="false"
                                                aria-controls="flush-collapseOne"
                                            >
                                                <span className="me-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-60q-29 0-49.5-20.5T410-480q0-29 20.5-49.5T480-550q29 0 49.5 20.5T550-480q0 29-20.5 49.5T480-410Zm0-70Zm-44 340h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Z" /></svg>
                                                </span>
                                                provider settings
                                                <span>
                                                    <svg className="offCanvasDropDownIcon" xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-384 288-576h384L480-384Z" /></svg>
                                                </span>
                                            </span>
                                        </h2>
                                        <div
                                            id="flush-collapseOne"
                                            className="accordion-collapse collapse"
                                            data-bs-parent="#accordionFlushExample"
                                        >
                                            <div className="accordion-body mx-auto">
                                                <UserServiceSettings />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <span
                                                className="collapsed settingsLabel accordionMarginTopAdjustement"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#flush-collapseTwo"
                                                aria-expanded="false"
                                                aria-controls="flush-collapseTwo"
                                            >
                                                <span className="me-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18"><path d="M480-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM160-160v-94q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5t127.921 44.694q31.301 14.126 50.19 40.966Q800-292 800-254v94H160Zm60-60h520v-34q0-16-9.5-30.5T707-306q-64-31-117-42.5T480-360q-57 0-111 11.5T252-306q-14 7-23 21.5t-9 30.5v34Zm260-321q39 0 64.5-25.5T570-631q0-39-25.5-64.5T480-721q-39 0-64.5 25.5T390-631q0 39 25.5 64.5T480-541Zm0-90Zm0 411Z" /></svg>
                                                </span>
                                                account details
                                                <span>
                                                    <svg className="offCanvasDropDownIcon" xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-384 288-576h384L480-384Z" /></svg>
                                                </span>
                                            </span>
                                        </h2>
                                        <div
                                            id="flush-collapseTwo"
                                            className="accordion-collapse collapse"
                                            data-bs-parent="#accordionFlushExample"
                                        >
                                            <div className="accordion-body">
                                                <div className="settingsTitles">name</div>
                                                <div className="settingsTitles">email</div>
                                                <div className="settingsTitles">addresses</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <span
                                                className="collapsed settingsLabel"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#flush-collapseThree"
                                                aria-expanded="false"
                                                aria-controls="flush-collapseThree"
                                            >

                                                <span className="me-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M880-740v520q0 24-18 42t-42 18H140q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42ZM140-631h680v-109H140v109Zm0 129v282h680v-282H140Zm0 282v-520 520Z" /></svg>
                                                </span>
                                                credti card info
                                                <span>
                                                    <svg className="offCanvasDropDownIcon" xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-384 288-576h384L480-384Z" /></svg>
                                                </span>
                                            </span>
                                        </h2>
                                        <div
                                            id="flush-collapseThree"
                                            className="accordion-collapse collapse"
                                            data-bs-parent="#accordionFlushExample"
                                        >
                                            <div className="accordion-body">
                                                <div className="settingsTitles">type</div>
                                                <div className="settingsTitles">number</div>
                                                <div className="settingsTitles">csv</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span
                            type="button"
                            className="dimissBanner ps-3 pt-3"
                        ></span>
                    </nav>
                    {/* SECOND NAVBAR */}
                    {/* Request Service */}
                    {selectedSection === "requestService" && (
                        <nav className="navbar fixed-top secondNavBar d-flex justify-content-center align-items-center ">
                            <div className="d-flex justify-content-center align-items-center">
                                {/* Category Dropdown*/}
                                <div className="dropdown ribbonElement1">
                                    <button
                                        className="border-0"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span className="dropDownIcon1">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M384-264v-72h192v72H384ZM240-444v-72h480v72H240Zm-96-180v-72h672v72H144Z" /></svg>
                                        </span>
                                        <span className="pullDownLabel me-1">Category</span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-384 288-576h384L480-384Z" /></svg>
                                        </span>
                                        <span className="pullDownLabel italic ms-1">{selectedServiceCategory}</span>
                                    </button>
                                    <ul className="dropdown-menu rounded-0">
                                        {serviceCategories.map((category, index) => (
                                            <li className="list-item" key={index} onClick={() => handleServiceCategorySelect(category)}>
                                                {category}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Price Dropdown*/}
                                <div className="dropdown ribbonElement2">
                                    <button
                                        className="border-0"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span className="dropDownIcon2">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M192-96v-72h576v72H192Zm288-144L336-384l51-51 57 57v-204l-57 57-51-51 144-144 144 144-51 51-57-57v204l57-57 51 51-144 144ZM192-792v-72h576v72H192Z" /></svg>
                                        </span>
                                        <span className="pullDownLabel me-1">Price</span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-384 288-576h384L480-384Z" /></svg>
                                        </span>
                                        <span className="pullDownLabel italic ms-1">{selectedServicePrice}</span>
                                    </button>
                                    <ul className="dropdown-menu rounded-0">
                                        <li className="list-item" key={0} onClick={() => handleServicePriceSelect("Any price")}>
                                            Any price
                                        </li>
                                        <li className="list-item" key={1} onClick={() => handleServicePriceSelect(`${servicePrices.interval1Min}€ - ${servicePrices.interval1Max}€`)}>
                                            {servicePrices.interval1Min}€ - {servicePrices.interval1Max}€
                                        </li>
                                        <li className="list-item" key={2} onClick={() => handleServicePriceSelect(`${servicePrices.interval2Min}€ - ${servicePrices.interval2Max}€`)}>
                                            {servicePrices.interval2Min}€ - {servicePrices.interval2Max}€
                                        </li>
                                        <li className="list-item" key={3} onClick={() => handleServicePriceSelect(`${servicePrices.interval3Min}€ - ${servicePrices.interval3Max}€`)}>
                                            {servicePrices.interval3Min}€ - {servicePrices.interval3Max}€
                                        </li>
                                    </ul>
                                </div>
                                {/* Search Bar*/}
                                <div className="ribbonElement3">
                                    <form role="search">
                                        <span className="menuIcon3">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M765-144 526-383q-30 22-65.792 34.5T384.035-336Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.035q0 40.381-12.5 76.173T577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" /></svg>
                                        </span>
                                        <label htmlFor="serviceSearchField" className="pullDownLabel me-1">Find:</label>
                                        <input
                                            id="serviceSearchField"
                                            type="search"
                                            placeholder="Type…"
                                            aria-label="Search"
                                            value={serviceSearchBar}
                                            onChange={handleChangeServiceSearchBar}
                                        />
                                    </form>
                                </div>
                            </div>
                        </nav>
                    )}
                    {/* SECOND NAVBAR */}
                    {/* My Requests */}
                    {selectedSection === "myRequests" && (
                        <nav className="navbar fixed-top secondNavBar d-flex justify-content-center align-items-center ">
                            <div className="d-flex justify-content-center align-items-center">
                                {/* Sort by Dropdown*/}
                                <div className="dropdown ribbonElement1">
                                    <button
                                        className="border-0"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span className="dropDownIcon1">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M531-338h60v-405H448v60h83v345ZM260-200q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h560q24 0 42 18t18 42v560q0 24-18 42t-42 18H260Zm0-60h560v-560H260v560ZM140-80q-24 0-42-18t-18-42v-620h60v620h620v60H140Zm120-740v560-560Z" /></svg>
                                        </span>
                                        <span className="pullDownLabel me-1">Sort by</span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-384 288-576h384L480-384Z" /></svg>
                                        </span>
                                        <span className="pullDownLabel italic ms-1">{selectedSortRequestsBy}</span>
                                    </button>
                                    <ul className="dropdown-menu rounded-0" key="sortByList">
                                        <li className="list-item" onClick={() => { handleClickSortRequestsBy("Newest") }}>
                                            Newest
                                        </li>
                                        <li className="list-item" onClick={() => { handleClickSortRequestsBy("Oldest") }}>
                                            Oldest
                                        </li>
                                        <li className="list-item" onClick={() => { handleClickSortRequestsBy("More affordable") }}>
                                            More affordable
                                        </li>
                                        <li className="list-item" onClick={() => { handleClickSortRequestsBy("More expensive") }}>
                                            More expensive
                                        </li>
                                    </ul>
                                </div>
                                {/* Filter by Dropdown*/}
                                <div className="dropdown ribbonElement2">
                                    <button
                                        className="border-0"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span className="dropDownIcon2">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M440-160q-17 0-28.5-11.5T400-200v-240L161-745q-14-17-4-36t31-19h584q21 0 31 19t-4 36L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-276 240-304H240l240 304Zm0 0Z" /></svg>
                                        </span>
                                        <span className="pullDownLabel me-1">Show</span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-384 288-576h384L480-384Z" /></svg>
                                        </span>
                                        <span className="pullDownLabel italic ms-1">{selectedFilterRequestsBy}</span>
                                    </button>
                                    <ul className="dropdown-menu rounded-0">
                                        <li className="list-item" key={0} onClick={() => handleClickFilterRequestsBy("All requests")}>
                                            All requests
                                        </li>
                                        <li className="list-item" key={1} onClick={() => handleClickFilterRequestsBy("Requested")}>
                                            Requested
                                        </li>
                                        <li className="list-item" key={2} onClick={() => handleClickFilterRequestsBy("Provided")}>
                                            Provided
                                        </li>
                                        <li className="list-item" key={3} onClick={() => handleClickFilterRequestsBy("Renewed")}>
                                            Renewed
                                        </li>
                                        <li className="list-item" key={4} onClick={() => handleClickFilterRequestsBy("Reviewed")}>
                                            Reviewed
                                        </li>
                                        <li className="list-item" key={5} onClick={() => handleClickFilterRequestsBy("Completed")}>
                                            Completed
                                        </li>
                                        <li className="list-item" key={6} onClick={() => handleClickFilterRequestsBy("Expired")}>
                                            Expired
                                        </li>
                                    </ul>
                                </div>
                                {/* Search Bar*/}
                                <div className="ribbonElement3">
                                    <form role="search">
                                        <span className="menuIcon3">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M765-144 526-383q-30 22-65.792 34.5T384.035-336Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.035q0 40.381-12.5 76.173T577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" /></svg>
                                        </span>
                                        <label htmlFor="requestSearchField" className="pullDownLabel me-1">Find:</label>
                                        <input
                                            id="requestSearchField"
                                            type="search"
                                            placeholder="Type…"
                                            aria-label="Search"
                                            value={requestsSearchBar}
                                            onChange={handleChangeRequestsSearchBar}
                                        />
                                    </form>
                                </div>
                            </div>
                        </nav>
                    )}
                    {/* SECIOD NAVBAR */}
                    {/* Notifications */}
                    {selectedSection === "notifications" && (
                        <nav className="navbar fixed-top secondNavBar d-flex justify-content-center align-items-center ">
                            <div className="d-flex justify-content-center align-items-center">
                                {/* Sort by Dropdown*/}
                                <div className="dropdown ribbonElement1">
                                    <button
                                        className="border-0"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span className="dropDownIcon1">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M531-338h60v-405H448v60h83v345ZM260-200q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h560q24 0 42 18t18 42v560q0 24-18 42t-42 18H260Zm0-60h560v-560H260v560ZM140-80q-24 0-42-18t-18-42v-620h60v620h620v60H140Zm120-740v560-560Z" /></svg>
                                        </span>
                                        <span className="pullDownLabel me-1">Sort by</span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-384 288-576h384L480-384Z" /></svg>
                                        </span>
                                        <span className="pullDownLabel italic ms-1">{selectedSortNotificationsBy}</span>
                                    </button>
                                    <ul className="dropdown-menu rounded-0" key="sortByList">
                                        <li className="list-item" onClick={() => { handleClickSortNotificationsBy("Newest") }}>
                                            Newest
                                        </li>
                                        <li className="list-item" onClick={() => { handleClickSortNotificationsBy("Oldest") }}>
                                            Oldest
                                        </li>
                                    </ul>
                                </div>
                                {/* Filter by Dropdown*/}
                                <div className="dropdown ribbonElement2">
                                    <button
                                        className="border-0"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span className="dropDownIcon2">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M440-160q-17 0-28.5-11.5T400-200v-240L161-745q-14-17-4-36t31-19h584q21 0 31 19t-4 36L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-276 240-304H240l240 304Zm0 0Z" /></svg>
                                        </span>
                                        <span className="pullDownLabel me-1">Show</span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-384 288-576h384L480-384Z" /></svg>
                                        </span>
                                        <span className="pullDownLabel italic ms-1">{selectedFilterNotificationsBy}</span>
                                    </button>
                                    <ul className="dropdown-menu rounded-0">
                                        <li className="list-item" key={0} onClick={() => handleClickFilterNotificationsBy("All notifications")}>
                                            All notifications
                                        </li>
                                        <li className="list-item" key={1} onClick={() => handleClickFilterNotificationsBy("Acceptances")}>
                                            Acceptances
                                        </li>
                                        <li className="list-item" key={2} onClick={() => handleClickFilterNotificationsBy("Cancellations")}>
                                            Cancellations
                                        </li>
                                        <li className="list-item" key={3} onClick={() => handleClickFilterNotificationsBy("Promotional")}>
                                            Promotional
                                        </li>
                                        <li className="list-item" key={4} onClick={() => handleClickFilterNotificationsBy("Support")}>
                                            Support
                                        </li>
                                    </ul>
                                </div>
                                {/* Search Bar*/}
                                <div className="ribbonElement3">
                                    <form role="search">
                                        <span className="menuIcon3">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M765-144 526-383q-30 22-65.792 34.5T384.035-336Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.035q0 40.381-12.5 76.173T577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" /></svg>
                                        </span>
                                        <label htmlFor="requestSearchField" className="pullDownLabel me-1">Find:</label>
                                        <input
                                            id="requestSearchField"
                                            type="search"
                                            placeholder="Type…"
                                            aria-label="Search"
                                            value={notificationsSearchBar}
                                            onChange={handleChangeNotificationsSearchBar}
                                        />
                                    </form>
                                </div>
                            </div>
                        </nav>
                    )}
                </header>
                <main>
                    {/* Request Service*/}
                    {selectedSection === "requestService" && (
                        <div className="main container-fluid m-0 p-0 g-0">
                            <div className="row d-flex justify content-center ">
                                {filteredServices && filteredServices.map((filteredService, index) => (
                                    <div className="col-12 d-flex justify-content-center" key={filteredService.id}>
                                        <div><ServiceRollUp serviceObject={filteredService} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>)
                    }
                    {/* My requests*/}
                    {selectedSection === "myRequests" && (
                        <div className="main container-fluid m-0 p-0 g-0">
                            <div className="row d-flex justify content-center ">
                                {filteredRequests && filteredRequests.map((filteredRequest, index) => (
                                    <div className="col-12 d-flex justify-content-center" key={filteredRequest.id}>
                                        <div><RequestRollUp requestObject={filteredRequest} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>)
                    }
                    {/* Notifications*/}
                    {selectedSection === "notifications" && (
                        <div className="main container-fluid m-0 p-0 g-0">
                            <div className="row d-flex justify content-center ">
                                {filteredNotifications && filteredNotifications.map((filteredNotification) => (
                                    <div className="col-12 d-flex justify-content-center" key={filteredNotification.id}>
                                        <div><NotificationRollUp notificationObject={filteredNotification} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>)
                    }
                </main>
            </div>
        </>
    );

};

