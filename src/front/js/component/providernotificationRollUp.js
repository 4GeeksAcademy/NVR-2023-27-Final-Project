import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const ProviderNotificationRollUp = (props) => {

    const { store, actions } = useContext(Context);
    const { id, type_of_notification, status, publishing_date_time, message, service_request_id } = props.notificationObject;

    const typeOfNotificationMap = new Map([
        [1, "Acceptances"],
        [2, "Cancellations"],
        [3, "Promotional"],
        [4, "Support"],

    ])

    // Handle Functions


    // Subcomponents


    // Pre-processing Props

    const dateString = "Victory"
    const timeString = "Yes"

    // Main JSX
    return (
        <>
        <div className="container-fluid my-1">
                <div className="requestRollUp my-1" id={id}>
                    <div className="requestRollUpBanner">
                        <div className="requestRollUpColumns d-flex mx-0 px-0 g-0">
                            <div className="requestRollUpColumn1 d-flex justify-content-start">
                                <div className="requestRollUpTitleWrapper">
                                   {typeOfNotificationMap.get(type_of_notification)}
                                </div>
                            </div>
                            <div className="requestRollUpColumn4">
                                <span className="rollUpDescription">date:</span>
                            </div>
                            <div className="requestRollUpColumn5">
                                <span className="rollUpValue">{dateString}</span>
                            </div>
                            <div className="requestRollUpColumn6">
                                <span className="rollUpDescription">time:</span>
                            </div>
                            <div className="requestRollUpColumn7">
                                <span className="rollUpValue">{timeString}</span>
                            </div>
                            <div className="requestRollUpColumn8">
                                <span className="rollUpValue">{publishing_date_time}</span>
                            </div>
                          
                            <div className="requestRollUpColumn10">

                            </div>
                        </div>
                    </div>
                    <div className="requestExpandableWrapper" id={"requestExpandableWrapperId" + id}>
                        <div className="requestExpandable">
                            <div className="requestExpandableContent">
                                {message}
                            </div>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
        </>
    );
};



