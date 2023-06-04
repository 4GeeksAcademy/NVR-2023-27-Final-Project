import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/privateuser.css";

export const PrivateUser = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState("requestService");

    // SERVICE REQUEST variables
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedPrice, setSelectedPrice] = useState("Any price");
    const [serviceSearchBar, setServiceSearchBar] = useState("");
    const [newServiceDate, setNewServiceDate] = useState(new Date().toISOString().slice(0, 10));
    const [newServiceTime, setNewServiceTime] = useState("09:00");
    const [newServiceQuantity, setNewServiceQuantity] = useState(1);
    const [newServiceRecurrency, setNewServiceReccurency] = useState(1);
    const [categories, setCategories] = useState([]);
    const [prices, setPrices] = useState(["Any price", "More affordable", "Mid range", "More expebsive"]);
    let priceIntervals = {};
    // 
    useEffect(() => {
        const checkCredentials = () => {
            if (!localStorage.getItem("credentials")) { navigate("/") };
        };

        checkCredentials();
        actions.getServiceDescriptions();

    }, []);

    useEffect(() => {
        const findPriceIntervals = () => {
            if (store.serviceDescriptions.length === 0) {
                return null; // Return null if the matrix is empty
            }

            const prices = store.serviceDescriptions.map((item) => item.price); // Extract all prices
            const lowestPrice = Math.min(...prices); // Find the lowest price
            const highestPrice = Math.max(...prices); // Find the highest price

            const intervalRange = (highestPrice - lowestPrice) / 3; // Calculate the range of each interval

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
            const newCategories = ["All Categories", ...new Set(store.serviceDescriptions.map((service) => service.category))].sort();
            setCategories(newCategories);

            priceIntervals = findPriceIntervals();

            const updatedPrices = [
                "Any price",
                `${priceIntervals.interval1Min}€ - ${priceIntervals.interval1Max}€`,
                `${priceIntervals.interval2Min}€ - ${priceIntervals.interval2Max}€`,
                `${priceIntervals.interval3Min}€ - ${priceIntervals.interval3Max}€`
            ];
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
                        ><span>notifications</span></button>
                        <button onClick={handleSignout}>Sign Out</button>
                        <button>Avatar</button>
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
                                        {prices.map((price, index) => (
                                            <li className="list-item" key={index} onClick={() => handlePriceSelect(price)}>
                                                {price}
                                            </li>
                                        ))}
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
                                            placeholder="Type to search for services "
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
                <div className="main container-fluid">
                    <div className="row p-3">
                        <p>{localStorage.getItem("credentials")}</p>
                        {selectedCategory}
                        {selectedPrice}
                        {serviceSearchBar}
                    </div>
                </div>
            </div>
        </>
    );


};