import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const RegisterUser = () => {
    const { store, actions } = useContext(Context);
    const [userCredentials, setUserCredentials] = useState({
        name: "",
        email: "",
        password: "",
        must_have_certificate: true,
        required_experience: 1,
        required_rating: 3,
        avatar_image: "",
    })

    const [userAddress, setUserAddress] = useState({
        street: "",
        apartment: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        lattitude: 0,
        longitude: 0,

    });

    const navigate = useNavigate();

    const handleClickHome = () => {
        navigate("/");
    }
    const handleClickPrivate = () => {
        navigate("/privateUser");
    }

    const handleChangeCredentials = (event) => {
        const { name, value } = event.target;
        setUserCredentials((previousCredentials) => ({ ...previousCredentials, [name]: value }));
    };

    const handleChangeAddress = (event) => {
        const { name, value } = event.target;
        setUserAddress((previousAddress) => ({ ...previousAddress, [name]: value }));
    };
  
    const handleSubmitCredentials = (event) => {
        event.preventDefault();
        alert("Submit credentials");
    };

    const handleSubmitAddress = (event) => {
        event.preventDefault();
        alert("Submit Address");

    };

    return (
        <>
            <p>Register user</p>
            <button className="btn btn-primary mx-3" onClick={handleClickHome}>
                Home
            </button>
            <button className="btn btn-success mx-3" onClick={handleClickPrivate}>
                Private
            </button>
            {/* Credentials Form */}
            <div>
                <form className="w-50 mx-auto" onSubmit={handleSubmitCredentials}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={userCredentials.name}
                            onChange={handleChangeCredentials}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Emall</label>
                        <input
                            type="text"
                            className="form-control"
                            name="email"
                            value={userCredentials.email}
                            onChange={handleChangeCredentials}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="text"
                            className="form-control"
                            name="password"
                            value={userCredentials.password}
                            onChange={handleChangeCredentials}
                        />
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary" >
                            Submit Credentials
                        </button>
                    </div>
                </form>
                <div>
                    <h2>Credentials:</h2>
                    <pre>{JSON.stringify(userCredentials, null, 2)}</pre>
                </div>
            </div>
            {/* Main Address Form */}
            <div>
                <form className="w-50 mx-auto" onSubmit={handleSubmitAddress}>
                    <div className="mb-3">
                        <label className="form-label">Street</label>
                        <input
                            type="text"
                            className="form-control"
                            name="street"
                            value={userAddress.street}
                            onChange={handleChangeAddress}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Apartment</label>
                        <input
                            type="text"
                            className="form-control"
                            name="apartment"
                            value={userAddress.apartment}
                            onChange={handleChangeAddress}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">City</label>
                        <input
                            type="text"
                            className="form-control"
                            name="city"
                            value={userAddress.city}
                            onChange={handleChangeAddress}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">State</label>
                        <input
                            type="text"
                            className="form-control"
                            name="state"
                            value={userAddress.state}
                            onChange={handleChangeAddress}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Postal Code</label>
                        <input
                            type="text"
                            className="form-control"
                            name="postalCode"
                            value={userAddress.postalCode}
                            onChange={handleChangeAddress}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Country</label>
                        <input
                            type="text"
                            className="form-control"
                            name="country"
                            value={userAddress.country}
                            onChange={handleChangeAddress}
                        />
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary" >
                            Submit Address
                        </button>
                    </div>
                </form>
                <div>
                    <h2>Address:</h2>
                    <pre>{JSON.stringify(userAddress, null, 2)}</pre>
                </div>
            </div>


        </>
    );
};