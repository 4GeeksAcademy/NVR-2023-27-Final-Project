import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

import { ServiceRollUp } from "../component/serviceRollUp";
import "../../styles/privateuser.css";

export const PrivateUser = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState("requestService");

    // SERVICE REQUEST variables
    const [selectedCategory, setSelectedCategory] = useState("Any category");
    const [selectedPrice, setSelectedPrice] = useState("Any price");
    const [serviceSearchBar, setServiceSearchBar] = useState("");

    const [newServiceDate, setNewServiceDate] = useState(new Date().toISOString().slice(0, 10));
    const [newServiceTime, setNewServiceTime] = useState("09:00");
    const [newServiceQuantity, setNewServiceQuantity] = useState(1);
    const [newServiceRecurrency, setNewServiceReccurency] = useState(1);
    const [newServiceAddress, setNewServiceAddress] = useState("");

    const [categories, setCategories] = useState([]);
    const [prices, setPrices] = useState({});
    let filteredServices = null;

    // 
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
            setCategories(newCategories);

            const updatedPrices = findPriceIntervals();
            setPrices(updatedPrices);


        }

    }, [store.serviceDescriptions]);


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

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setServiceSearchBar("");
    };

    const handlePriceSelect = (price) => {
        setSelectedPrice(price);
        setServiceSearchBar("");
    };

    const handleChangeSearchBar = (event) => {
        setServiceSearchBar(event.target.value);
    };


    if (store.serviceDescriptions) {
        filteredServices = store.serviceDescriptions.filter((service) => {
            // Filter by category
            if (selectedCategory !== "Any category" && service.category !== selectedCategory) {
                return false;
            }

            // Filter by price
            if (selectedPrice !== "Any price") {
                const price = parseFloat(service.price);

                if (
                    (selectedPrice === `${prices.interval1Min}€ - ${prices.interval1Max}€` && (price < prices.interval1Min || price >= prices.interval1Max)) ||
                    (selectedPrice === `${prices.interval2Min}€ - ${prices.interval2Max}€` && (price < prices.interval2Min || price >= prices.interval2Max)) ||
                    (selectedPrice === `${prices.interval3Min}€ - ${prices.interval3Max}€` && (price < prices.interval3Min || price >= prices.interval3Max))
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

        filteredServices.sort((firstService, secondService) => {
            const categoryComparison = firstService.category.localeCompare(secondService.category);
            if (categoryComparison === 0) {
                return firstService.service.localeCompare(secondService.service);
            }
            return categoryComparison;
        });
    };

    return (
        <>
            <div className="container-fluid mx-0 px-0 gx-0">
                <header>
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
                        <button
                            className="avatarButton"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasScrolling"
                            aria-controls="offcanvasScrolling"
                        >
                            Avatar
                        </button>
                        {/* test */}
                   
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
                                                    <span className="pullDownLabel italic ms-1">{selectedCategory}</span>
                                                </button>
                                                <ul className="dropdown-menu rounded-0">
                                                    {categories.map((category, index) => (
                                                        <li className="list-item" key={index} onClick={() => handleCategorySelect(category)}>
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
                                                    <span className="pullDownLabel italic ms-1">{selectedPrice}</span>
                                                </button>
                                                <ul className="dropdown-menu rounded-0">
                                                    <li className="list-item" key={0} onClick={() => handlePriceSelect("Any price")}>
                                                        Any price
                                                    </li>
                                                    <li className="list-item" key={1} onClick={() => handlePriceSelect(`${prices.interval1Min}€ - ${prices.interval1Max}€`)}>
                                                        {prices.interval1Min}€ - {prices.interval1Max}€
                                                    </li>
                                                    <li className="list-item" key={2} onClick={() => handlePriceSelect(`${prices.interval2Min}€ - ${prices.interval2Max}€`)}>
                                                        {prices.interval2Min}€ - {prices.interval2Max}€
                                                    </li>
                                                    <li className="list-item" key={3} onClick={() => handlePriceSelect(`${prices.interval3Min}€ - ${prices.interval3Max}€`)}>
                                                        {prices.interval3Min}€ - {prices.interval3Max}€
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* Search Bar*/}
                                            <div className="ribbonElement3">
                                                <form role="search">
                                                    <span className="menuIcon3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M765-144 526-383q-30 22-65.792 34.5T384.035-336Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.035q0 40.381-12.5 76.173T577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" /></svg>
                                                    </span>
                                                    <label htmlFor="searchField" className="pullDownLabel me-1">Find:</label>
                                                    <input
                                                        id="searchField"
                                                        type="search"
                                                        placeholder="Type…"
                                                        aria-label="Search"
                                                        value={serviceSearchBar}
                                                        onChange={handleChangeSearchBar}
                                                    />
                                                </form>
                                            </div>
                                        </div>
                                    </nav>
                                )}
                                {selectedSection === "myRequests" && (
                                    <nav className="navbar fixed-top p-3 secondNavBar">
                                        My Requests
                                    </nav>
                                )}
                                {selectedSection === "notifications" && (
                                    <nav className="navbar fixed-top p-3 secondNavBar">
                                        Notifications
                                    </nav>
                                )}
                            </header>
                            <main>
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

                            </main>
                        </div>
                    </>
                    );


};

