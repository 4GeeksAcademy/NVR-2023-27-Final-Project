import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const SafeguardrModal = (props) => {
    
    // prop destructuring
    const { id, provider_id } = props;

    return (
        <>
            <dialog data-modal id={"dialogSafeguard" + id} className="largeDialogElement">
                <div className="calendarModalWrapper my-3">
                    <div>
                        SafeGuard Modal connected
                    </div>
                    <p>id: {id}</p>
                    <p>provider_id: {provider_id}</p>
                </div>
            </dialog >
        </>
    );

};