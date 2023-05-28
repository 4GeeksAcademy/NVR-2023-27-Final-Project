import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const PrivateUser = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    actions.getServiceDescriptions();
  }, []);

  const handleClickHome = () => {
    navigate("/");
  };

  return (
    <>
      <nav className="navbar bg-light fixed-top">
        <div className="container-fluid">
          <button className="btn btn-primary" onClick={(handleClickHome)}>
            Home
          </button>
          <div className="dropdown">
            <button
              className="bg-light border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Category
            </button>
            <ul className="dropdown-menu rounded-0">
              <li>
                  Action
              </li>
              <li>
                  Another action
              </li>
              <li>
                Something else here
              </li>
            </ul>
          </div>

          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>

          </form>
        </div>
      </nav>

      {/* Display service descriptions */}
      <div className="py-5">
        {store.serviceDescriptions.map((description, index) => (
          <div key={index}>
            <h3>Category: {description.category}</h3>
            <p>Service: {description.service}</p>
            <p>Description: {description.description}</p>
            <p>Unit: {description.unit}</p>
            <p>Duration: {description.duration}</p>
            <p>Personnel: {description.personnel}</p>
            <p>Includes: {description.included}</p>
            <p>Price: {description.price}</p>
          </div>
        ))}
      </div>
    </>
  );
};
