import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const RegisterProvider = () => {
    const { store, actions } = useContext(Context);
    const [providerCredentials, setProviderCredentials] = useState({
        name: "",
        email: "",
        password: "",
        has_certificate: true,
        experience: 1,
        service_radius: 5,
        average_rating: 3,
        ratings_counter: 1,
        avatar_image: "",
    })


    const [providerAddress, setProviderAddress] = useState({
        is_main: true,
        street: "",
        apartment: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        latitude: 0,
        longitude: 0,
        user_id: null,
        provider_id: null

    });


    const navigate = useNavigate();

    const handleClickHome = () => {
        navigate("/");
    }
    const handleClickPrivate = () => {
        navigate("/privateProvider");
    }

    const handleChangeCredentials = (event) => {
        const { name, value } = event.target;
        setProviderCredentials((previousCredentials) => ({ ...previousCredentials, [name]: value }));
    };

    const handleChangeAddress = (event) => {
        const { name, value } = event.target;
        setProviderAddress((previousAddress) => ({ ...previousAddress, [name]: value }));
    };

    const getAddressGeoCoordinates = async (address) => {

        // AUxiliary function
        const getAddressString = () => {
            const addressString = Object.entries(address)
                .filter(([key, value]) => key !== "is_main" && key !== "latitude" && key !== "longitude" && key !== "user_id" && key !== "provider_id" && value !== "")
                .map(([key, value]) => value)
                .join(', ');
            return addressString;
        };

        const addressString = getAddressString(address);
        const apiKey = "AIzaSyA0Wq3nAEPCtgSku9z8_bcRM7-NTyGKRVk";
        const url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + addressString + "+CA&key=" + apiKey;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Google API call failed:" + response.status);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // handleSubmitForm 
    const handleSubmitForm = async (event) => {
        event.preventDefault();

        // handleSubmitForm auxiliary functions
        const registerNewProvider = async (credentials) => {
            try {
                const response = await fetch(process.env.BACKEND_URL + "api/providers", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(credentials),
                });
                if (response.ok) {
                    console.log("Provider successfully created");
                    const data = await response.json();
                    return data.id;
                }
            } catch (error) {
                console.error("Error registering provider:", error);
                return false;
            }
        };

        const registerNewAddress = async (address) => {
            try {
                const response = await fetch(process.env.BACKEND_URL + "api/addresses", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(address),
                });
                if (response.ok) {
                    console.log("address successfully created");
                    const data = await response.json();
                    return data.id;
                }
            } catch (error) {
                console.error("Error registering address:", error);
                return false;
            }
        };

        // Main Function
        const mainApiResponse = await getAddressGeoCoordinates(providerAddress);
        let addressLatitude, addressLongitude = 0;
        if (mainApiResponse) {
            addressLatitude = mainApiResponse.results[0].geometry.location.lat;
            addressLongitude = mainApiResponse.results[0].geometry.location.lng;
            setProviderAddress((currentProviderAddress) => ({
                ...currentProviderAddress,
                latitude: addressLatitude,
                longitude: addressLongitude,
            }));
        }

        const newProviderId = await registerNewProvider(providerCredentials);
        const mainAddressCopy = { ...providerAddress, provider_id: newProviderId, latitude: addressLatitude, longitude: addressLongitude }
        try {
            await registerNewAddress(mainAddressCopy);
        } catch (error) {
            console.error("Error occurred while registering Provider's Address:", error);
        }
        navigate("/");
    };

    return (
        <>
            <p>Register Provider</p>
            <button className="btn btn-primary mx-3" onClick={handleClickHome}>
                Home
            </button>
            <button className="btn btn-success mx-3" onClick={handleClickPrivate}>
                Private
            </button>
            {/* Form */}
            <div>
                <form className="w-100 px-5" onSubmit={handleSubmitForm}>
                    <div className="row">
                        <div className="col-4">
                            <h2>Credentials:</h2>
                            <div className="mb-3">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={providerCredentials.name}
                                    onChange={handleChangeCredentials}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Email:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    value={providerCredentials.email}
                                    onChange={handleChangeCredentials}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Password:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="password"
                                    value={providerCredentials.password}
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
                                    value={providerAddress.street}
                                    onChange={handleChangeAddress}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Apartment:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="apartment"
                                    value={providerAddress.apartment}
                                    onChange={handleChangeAddress}
                                />
                            </div>
                            <div className="mb-3">
                                <label>City:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="city"
                                    value={providerAddress.city}
                                    onChange={handleChangeAddress}
                                />
                            </div>
                            <div className="mb-3">
                                <label>State:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="state"
                                    value={providerAddress.state}
                                    onChange={handleChangeAddress}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Postal Code:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="postal_code"
                                    value={providerAddress.postal_code}
                                    onChange={handleChangeAddress}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Country:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="country"
                                    value={providerAddress.country}
                                    onChange={handleChangeAddress}
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
            </div>
        </>
    );
};