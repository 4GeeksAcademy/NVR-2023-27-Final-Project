import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const SafeguardrModal = (props) => {

    const { store, actions } = useContext(Context);

    // prop destructuring
    const { id, provider_id } = props;

    let qrCodeImage = null;

    return (
        <>
            <dialog data-modal id={"dialogSafeguard" + id} className="servieRequestPasswordModal">
                <div className="passwordImagesWrapper">
                    {store.providerDetails ? (
                        <div className="providerAvatarImageWrapper" key={`providerAvatarImage${id}`}>
                            <img className="providerAvatarImage" src={store.providerDetails.avatar_image} />
                        </div>
                    ) : (
                        <div className="providerAvatarImageWrapper" key={`providerAvatarReplacement${id}`}>
                            <div className="providerAvatarReplacement"></div>
                        </div>
                    )}
                    {qrCodeImage ? (
                        <div className="qrCodeImageWrapper">
                            <img className="qrCodeImage" src={qrCodeImage} alt="QR Code" />
                        </div>
                    ) : (
                        <div className="qrCodeImageWrapper">
                            <div className="replacementQRCode"></div>
                        </div>
                    )}
                </div>
                <div>
                    {store.providerDetails ? (
                        <div>
                            <span>Average rating: {store.providerDetails.average_rating}</span>
                            <span>Ratings: {store.providerDetails.ratings_counter}</span>
                            <span>Level of Experience: {store.providerDetails.experience}</span>
                        </div>
                    ) : (<></>)}
                </div>
            </dialog>
        </>
    );

};