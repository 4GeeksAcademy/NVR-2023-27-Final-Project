import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

import { ServiceRollUp } from "../component/serviceRollUp";
import { RequestRollUp } from "../component/requestRollUp"
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

    const avatarInitials = getAvatarInitials(JSON.parse(localStorage.getItem("credentials")).name);

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

    const [selectedSortRequestsBy, setSelectedSorRequeststBy] = useState("Newest")
    const [selectedFilterRequestsBy, setSelectedFilterRequestsBy] = useState("All requests")
    const [requestSearchBar, setRequestSearchBar] = useState("");


    // Notifications


    // UseEffects

    useEffect(() => {
        const checkCredentials = () => {
            if (!localStorage.getItem("credentials")) {
                navigate("/");
            }
        };

        checkCredentials();

        if (localStorage.getItem("credentials")) {
            actions.getUserSettings();
            actions.getUserAddresses();
            actions.getUserExclusions();
            actions.getUserRequests();
            actions.getUserBookedDays();
            actions.getUserNotifications();
            actions.getServiceDescriptions();
            actions.alertUser(`welcome back, ${JSON.parse(localStorage.getItem("credentials")).name.toLowerCase()} `, "yellow", "black");

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

    //*************************
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
          if (requestSearchBar.trim() !== "") {
            const searchTerm = requestSearchBar.toLowerCase();
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
      }, [selectedSortRequestsBy, selectedFilterRequestsBy, requestSearchBar, selectedSection, store.userRequests, store.serviceDescriptions]);
    
    
    // UI handle functions

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
        setSelectedSorRequeststBy(sortBy);
    }

    const handleClickFilterRequestsBy = (filterBy) => {
        setSelectedFilterRequestsBy(filterBy);

    }

    const handleChangeRequestSearchBar = (event) => {
        setRequestSearchBar(event.target.value);
    };


    //Notifications


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
    
    else {
    }

    // Main JSX
    return (
        <>
            <div className="container-fluid mx-0 px-0 gx-0">
                <header>
                    {/* first Navbar */}
                    <nav className="navbar fixed-top px-3 firstBavBar">
                        <button onClick={() => handleSectionClick("home")}>Home</button>
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
                        <button onClick={handleSignout}>Sign Out</button>

                        {/* Avatar Initials */}

                        <button
                            className="avatarButton"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasScrolling"
                            aria-controls="offcanvasScrolling"
                        >
                            {avatarInitials}
                        </button>
                        {/* Offcanvas */}
                        <div className="offcanvas offcanvas-end sideBanner"
                            data-bs-scroll="true"
                            data-bs-backdrop="false"
                            tabIndex={-1}
                            id="offcanvasScrolling"
                            aria-labelledby="offcanvasScrollingLabel"
                        >
                            <span
                                className="btn-close"
                                data-bs-dismiss="offcanvas"
                                aria-label="Close"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M400-280v-400l200 200-200 200Z" /></svg>
                            </span>

                            {/* Offcanvas ACCORDION */}
                            <div className="offcanvas-body">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
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
                                        </h2>
                                        <div
                                            id="flush-collapseOne"
                                            className="accordion-collapse collapse"
                                            data-bs-parent="#accordionFlushExample"
                                        >
                                            <div className="accordion-body mx-auto">
                                                Placeholder
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
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
                                        </h2>
                                        <div
                                            id="flush-collapseTwo"
                                            className="accordion-collapse collapse"
                                            data-bs-parent="#accordionFlushExample"
                                        >
                                            <div className="accordion-body">
                                                Placeholder.
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
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
                                        </h2>
                                        <div
                                            id="flush-collapseThree"
                                            className="accordion-collapse collapse"
                                            data-bs-parent="#accordionFlushExample"
                                        >
                                            <div className="accordion-body">
                                                Placeholder.
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
                                            value={requestSearchBar}
                                            onChange={handleChangeRequestSearchBar}
                                        />
                                    </form>
                                </div>
                            </div>
                        </nav>

                    )}
                    {/* SECIOD NAVBAR */}
                    {/* Notifications */}
                    {selectedSection === "notifications" && (
                        <nav className="navbar fixed-top p-3 secondNavBar">
                            Notifications
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







                </main>
            </div>
        </>
    );

};

