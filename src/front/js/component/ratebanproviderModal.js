import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const RateBanrModal = (props) => {
    // prop destructuring
    const { store, actions } = useContext(Context);
    const { id, provider_id, service, date } = props;

    const [providerRating, setProviderRating] = useState(3);

    // handle functions

    const handleIncreaseRating = () => {
        if (providerRating === 5) {
          setProviderRating(1);
        } else {
          setProviderRating((previousValue) => previousValue + 0.5);
        }
      };
      

    const handleDecreaseRating = () => {
        if (providerRating === 1) {
            setProviderRating(5);
          } else {
            setProviderRating((previousValue) => previousValue - 0.5);
          }

    }

    const handleCloseRateBanModal = (id) => {
        const dialog = document.querySelector(`#dialogRateBan${id}`);
        dialog.close();
    };

    const handleRateProvider = () => { };
    
    // pre-rpocessing Props

    const serviceString = service.charAt(0).toUpperCase() + service.slice(1);
    
    // Subcomponents

    const StarRatingPicker = () => {

        const renderStar = (indexOfStar) => {
            if (indexOfStar <= Math.floor(providerRating)) {
                return <span className="filled-star">
                    <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="m233-80 65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z" /></svg>
                </span>;
            } else if (indexOfStar === Math.floor(providerRating) + 1 && providerRating % 1 !== 0) {
                return <span className="half-filled-star">
                    <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="m480-299 157 95-42-178 138-120-182-16-71-168v387ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z" /></svg>

                </span>;
            } else {
                return <span className="empty-star">
                    <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="m323-205 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Zm247-355Z" /></svg>
                </span>;
            }
        };

        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i}>{renderStar(i)}</span>
                ))}
            </div>
        );
    };


    // Main JSX
    return (
        <>
            <dialog data-modal id={"dialogRateBan" + id} className="largeDialogElement">
                <div className="row">
                    <div className="col-md-6">
                        {store.providerDetails ? (
                            <div className="providerAvatarImageWrapper p-0 m-0" key={`providerAvatarImage${id}`}>
                                <img className="providerAvatarImage" src={store.providerDetails.avatar_image} alt="Provider Avatar" />
                            </div>
                        ) : (
                            <div className="providerAvatarImageWrapper m-0 p-0" key={`providerAvatarReplacement${id}`}>
                                <div className="providerAvatarReplacement"></div>
                            </div>
                        )}
                    </div>
                    <div className="gx-4 col-md-6">
                        <div>
                            <div>
                                <span className="calendarModalTableLabel me-1">service:</span>
                                <span className="calendarModalTableValue">{serviceString}</span>
                            </div>
                            <div>
                                <span className="calendarModalTableLabel me-1">date:</span>
                                <span className="calendarModalTableValue">{date}</span>
                            </div>
                            <div>
                                <span className="calendarModalTableLabel me-1">provider:</span>
                                <span className="calendarModalTableValue">{store.providerDetails && store.providerDetails.name}</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="d-inline-flex align-items-center">
                                    <span className="calendarModalTableLabel">rating:</span>
                                    <StarRatingPicker />
                                    <button onClick={handleIncreaseRating} className="clickable">+</button>
                                    <button onClick={handleDecreaseRating} className="clickable">-</button>
                                </span>
                            </div>
                            <div>
                                <span><button>exclude</button></span>
                                <span><button>rate</button></span>
                            </div>
                        </div>
                        <div>
                            <button className="cancelButton" onClick={() => handleCloseRateBanModal(id)}>cancel</button>
                        </div>
                    </div>
                </div>
            </dialog>
        </>
    );
};
