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
        is_main: true,
        street: "",
        apartment: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        lattitude: 0,
        longitude: 0,

    });

    const [userSecondaryAddress, setUserSecondaryAddress] = useState({
        is_main: false,
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

    const handleChangeSecondaryAddress = (event) => {
        const { name, value } = event.target;
        setUserSecondaryAddress((previousSecondaryAddress) => ({ ...previousSecondaryAddress, [name]: value }));
    };

    const handleSubmitCredentials = (event) => {
        event.preventDefault();
        alert("Submit credentials");
    };

    const handleSubmitAddress = (event) => {
        event.preventDefault();
        alert("Submit Address");

    };

    const handleSubmitSecondaryAddress = (event) => {
        event.preventDefault();
        alert("Submit Secondary Address");

    };

    const handleSubmitForm = (event) => {
        event.preventDefault();
        alert("Submit Form");

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
            {/* Form */}
            <div>
                <form className="w-100 mx-3 px-3" onSubmit={handleSubmitForm}>
                    <div className="row">
                        <div className="col-4">
                            <h2>Credentials:</h2>
                            <div className="mb-3">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={userCredentials.name}
                                    onChange={handleChangeCredentials}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Email:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    value={userCredentials.email}
                                    onChange={handleChangeCredentials}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Password:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="password"
                                    value={userCredentials.password}
                                    onChange={handleChangeCredentials}
                                />
                            </div>
                        </div>

                        <div className="col-4">
                            <h2>Main Address:</h2>
                            <div className="mb-3">
                                <label>Street:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="street"
                                    value={userAddress.street}
                                    onChange={handleChangeAddress}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Apartment:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="apartment"
                                    value={userAddress.apartment}
                                    onChange={handleChangeAddress}
                                />
                            </div>
                            <div className="mb-3">
                                <label>City:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="city"
                                    value={userAddress.city}
                                    onChange={handleChangeAddress}
                                />
                            </div>
                            <div className="mb-3">
                                <label>State:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="state"
                                    value={userAddress.state}
                                    onChange={handleChangeAddress}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Postal Code:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="postalCode"
                                    value={userAddress.postalCode}
                                    onChange={handleChangeAddress}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Country:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="country"
                                    value={userAddress.country}
                                    onChange={handleChangeAddress}
                                />
                            </div>
                        </div>

                        <div className="col-4">
                            <h2>Secondary Address:</h2>
                            <div className="mb-3">
                                <label>Street:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="street"
                                    value={userSecondaryAddress.street}
                                    onChange={handleChangeSecondaryAddress}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Apartment:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="apartment"
                                    value={userSecondaryAddress.apartment}
                                    onChange={handleChangeSecondaryAddress}
                                />
                            </div>
                            <div className="mb-3">
                                <label>City:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="city"
                                    value={userSecondaryAddress.city}
                                    onChange={handleChangeSecondaryAddress}
                                />
                            </div>
                            <div className="mb-3">
                                <label>State:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="state"
                                    value={userSecondaryAddress.state}
                                    onChange={handleChangeSecondaryAddress}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Postal Code:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="postalCode"
                                    value={userSecondaryAddress.postalCode}
                                    onChange={handleChangeSecondaryAddress}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Country:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="country"
                                    value={userSecondaryAddress.country}
                                    onChange={handleChangeSecondaryAddress}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-success w-100">
                            Submit
                        </button>
                    </div>
                </form>


                <div className="row mx-3">
                    <div className="col">
                        <h2>Credentials:</h2>
                        <pre className="fs-3">{JSON.stringify(userCredentials, null, 2)}</pre>
                    </div>
                    <div className="col">
                        <h2>Address:</h2>
                        <pre className="fs-3">{JSON.stringify(userAddress, null, 2)}</pre>
                    </div>
                    <div className="col">
                        <h2>Secondary Address:</h2>
                        <pre className="fs-3">{JSON.stringify(userSecondaryAddress, null, 2)}</pre>
                    </div>
                </div>

            </div>
        </>
    );
};