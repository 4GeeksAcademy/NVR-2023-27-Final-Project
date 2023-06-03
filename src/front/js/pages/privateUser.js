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
    const [prices , setPrices] = useState(["Any price", "More affordable", "Mid range", "More expebsive"]);
    let priceIntervals={};
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
          
            const roundToTwoDecimalPlaces = (num) => {
                const roundedNum = Math.floor(num * 10) / 10;
                return roundedNum.toFixed(2);
              };
              
          
            const intervals = {
              interval1Min: roundToTwoDecimalPlaces(lowestPrice),
              interval1Max: roundToTwoDecimalPlaces(lowestPrice + intervalRange),
              interval2Min: roundToTwoDecimalPlaces(lowestPrice + intervalRange),
              interval2Max: roundToTwoDecimalPlaces(lowestPrice + intervalRange * 2),
              interval3Min: roundToTwoDecimalPlaces(lowestPrice + intervalRange * 2),
              interval3Max: roundToTwoDecimalPlaces(highestPrice),
            };
          
            return intervals;
          };        
        
        if (store.serviceDescriptions) {
            const newCategories = ["All Categories", ...new Set(store.serviceDescriptions.map((service) => service.category))].sort();
            setCategories(newCategories);
            
            priceIntervals = findPriceIntervals();
            
            const updatedPrices = [
                "Any price",
                `More affordable: ${priceIntervals.interval1Min}€ - ${priceIntervals.interval1Max}€`,
                `Mid range: ${priceIntervals.interval2Min}€ - ${priceIntervals.interval2Max}€`,
                `More expensive: ${priceIntervals.interval3Min}€ - ${priceIntervals.interval3Max}€`
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
                            {/* REQUEST A SERVICE SECTION*/}
                            {selectedSection === 'requestService' && (
                                <div className="row d-flex justify-content-center">
                                    {/* FILETR & SEARCH*/}
                                    {/* Category Dropdown*/}
                                    <div className="dropdown">
                                        <button
                                            className="border-0"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Category: {selectedCategory}
                                        </button>
                                        <ul className="dropdown-menu rounded-0">
                                            {categories.map((category, index) => (
                                                <li className="category-item" key={index} onClick={() => handleCategorySelect(category)}>
                                                    {category}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {/* Price Dropdown*/}
                                    <div className="dropdown">
                                        <button
                                            className="border-0"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Price: {selectedPrice}
                                        </button>
                                        <ul className="dropdown-menu rounded-0">
                                            {prices.map((price, index) => (
                                                <li className="price-item" key={index} onClick={() => handlePriceSelect(price)}>
                                                    {price}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        {selectedCategory}
                                        {selectedPrice}
                                    </div>
                                    {/* Search Bar*/}

                                  

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