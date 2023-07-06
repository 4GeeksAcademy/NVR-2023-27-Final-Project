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
                <div className="passwordImagesWrapper d-flex align-items-top ">
                    {store.providerDetails ? (
                        <div className="providerAvatarImageWrapper p-0 m-0" key={`providerAvatarImage${id}`}>
                            <img className="providerAvatarImage" src={store.providerDetails.avatar_image} />
                        </div>
                    ) : (
                        <div className="providerAvatarImageWrapper m-0 p-0" key={`providerAvatarReplacement${id}`}>
                            <div className="providerAvatarReplacement"></div>
                        </div>
                    )}
                    {qrCodeImage ? (
                        <div className="qrCodeImageWrapper">
                            <img className="qrCodeImage" src={qrCodeImage} alt="QR Code" />
                        </div>
                    ) : (
                        <div className="qrCodeImageWrapper">
                            <div className="replacementQRCode">enter qr password to generate qr code</div>
                        </div>
                    )}
                </div>
                <div>
                    {store.providerDetails ? (
                        <div>
                            <span>{store.providerDetails.name}</span>
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