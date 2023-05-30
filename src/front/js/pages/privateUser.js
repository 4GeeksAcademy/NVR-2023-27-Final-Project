import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/privateuser.css";

export const PrivateUser = () => {
  const [serviceSearchBar, setServiceSearchBar] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [newServiceDate, setNewServiceDate] = useState(new Date().toISOString().slice(0, 10));

  const [selectedPrice, setSelectedPrice] = useState("Any price");


  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleBook = (id, service, price) => {
    return true;
  };


  useEffect(() => {
    actions.getServiceDescriptions();
  }, []);

  const handleClickHome = () => {
    navigate("/");
  };

  const handleChangeSearchBar = (event) => {
    setServiceSearchBar(event.target.value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setServiceSearchBar("");
  };

  const handlePriceSelect = (price) => {
    setSelectedPrice(price);
    setServiceSearchBar("");
  };

  const filteredServices = store.serviceDescriptions.filter((service) => {
    // Filter by category
    if (selectedCategory !== "All Categories" && service.category !== selectedCategory) {
      return false;
    }

    // Filter by price
    if (selectedPrice !== "Any price") {
      const price = parseFloat(service.price);

      if (selectedPrice === "less than 50" && price >= 50) {
        return false;
      } else if (selectedPrice === "between 50 and 100" && (price < 50 || price > 100)) {
        return false;
      } else if (selectedPrice === "more than 100" && price <= 100) {
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

  const categories = ["All Categories", ...new Set(store.serviceDescriptions.map((service) => service.category))];
  categories.sort();

  return (
    <>
      <nav className="navbar bg-light fixed-top">
        <div className="container-fluid">
          <button className="btn btn-primary" onClick={handleClickHome}>
            Home
          </button>
          {/* Category dropdoiwn */}
          <div className="dropdown">
            <button
              className="bg-light border-0"
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
          {/* Price dropdoiwn */}
          <div className="dropdown">
            <button
              className="bg-light border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Price: {selectedPrice}
            </button>
            <ul className="dropdown-menu rounded-0">
              <li className="price-item" onClick={() => handlePriceSelect("Any price")}>
                Any price
              </li>
              <li className="price-item" onClick={() => handlePriceSelect("less than 50")}>
                Less than 50
              </li>
              <li className="price-item" onClick={() => handlePriceSelect("between 50 and 100")}>
                Between 50 and 100
              </li>
              <li className="price-item" onClick={() => handlePriceSelect("more than 100")}>
                More than 100
              </li>
            </ul>
          </div>

          {/* Search bar */}
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={serviceSearchBar}
              onChange={handleChangeSearchBar}
            />
          </form>
        </div>
      </nav>
      {/* Display filtered services */}
      <div className="py-5">
        <p>{serviceSearchBar}</p>
        {filteredServices.map((filteredService, index) => (
          <div className="service-wrapper mx-3 px-3" key={filteredService.id}>
            <p>Category: {filteredService.category}</p>
            <p>Service: {filteredService.service}</p>
            <span>Description: {filteredService.description}</span>
            <span>Unit: {filteredService.unit}</span>
            <span>Duration: {filteredService.duration}</span>
            <span>Personnel: {filteredService.personnel}</span>
            <span>Includes: {filteredService.included}</span>
            <span>Price: {filteredService.price}</span>
            <button type="button" data-bs-toggle="modal" data-bs-target="#bookModal" className="btn btn-success m-3" onClick={() => handleBook(filteredService.id, filteredService.service, filteredService.price)}>Book</button>
            <div className="modal fade" id="bookModal" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5">Book</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      service: {filteredService.service}
                    </div>
                    <div className="form-group">
                      price: {filteredService.price}
                    </div>
                    <input
                      className="task-input"
                      type="date"
                      id="datepicker"
                      name="datepicker"
                      lang="en"
                      min={new Date()
                        .toLocaleDateString("fr-CA")
                        .split("/")
                        .reverse()
                        .join("-")}
                      value={newServiceDate}
                      onChange={(event) => setNewServiceDate(event.target.value)}
                    />
                    {/* time picker */}
                    <input
                      type="time"
                      step="1800" // Step of 1800 seconds (30 minutes)
                      min="08:00" // Minimum time value
                      max="21:00" // Maximum time value
                      onInput={(event) => {
                        const inputTime = event.target.value.split(':');
                        const hours = parseInt(inputTime[0], 10);
                        const minutes = parseInt(inputTime[1], 10);

                        // Round minutes to either 0 or 30
                        const roundedMinutes = Math.round(minutes / 30) * 30;

                        // Adjust the input value
                        event.target.value = `${hours.toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`;
                      }}
                    />


                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => {
                      handleClickUserSignIn();
                    }} > Book</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div >
    </>
  );
};
