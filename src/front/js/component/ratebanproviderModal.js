import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const RateBanrModal = (props) => {
    // prop destructuring
    const { id, provider_id } = props;

    return (
        <>
            <dialog data-modal id={"dialogRateBan" + id} className="largeDialogElement">
                <div className="calendarModalWrapper my-3">
                    <div>
                        Rateban Modal connected
                    </div>
                    <p>id: {id}</p>
                    <p>provider_id: {provider_id}</p>
                </div>
            </dialog >
        </>
    );

};