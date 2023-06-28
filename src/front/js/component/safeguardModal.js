import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const SafeguardrModal = (props) => {

    const { store, actions } = useContext(Context);
   
    // prop destructuring
    const { id, provider_id } = props;
 

    return (
        <>
            <dialog data-modal id={"dialogSafeguard" + id} className="servieRequestPasswordModal">
                <div className="passwordImagesWrapper">
                        { store.providerDetails &&  
                            (<div className="providerAvatarImageWrapper" key={`providerAvatarImage${id}`}>
                                <img className="providerAvatarImage" src={store.providerDetails.avatar_image}>
                                </img>
                            </div>)
                        }
                        <p>provider_id: {provider_id}</p>
                        <div>
                            SafeGuard Modal connected
                        </div>
                        <p>id: {id}</p>
                </div>
            </dialog >
        </>
    );

};