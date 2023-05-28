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
      <p>Private user</p>
      <button className="btn btn-primary mx-3" onClick={handleClickHome}>
        Home
      </button>

      {/* Display service descriptions */}
      <div>
        {store.serviceDescriptions.map((description, index) => (
          <div key={index}>
            <h3>{description.category}</h3>
            <p>{description.service}</p>
            <p>{description.description}</p>
            <p>{description.unit}</p>
            <p>{description.duration}</p>
            <p>{description.personnel}</p>
            <p>{description.included}</p>
            <p>{description.price}</p>
          </div>
        ))}
      </div>
    </>
  );
};
