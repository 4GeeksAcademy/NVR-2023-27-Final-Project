import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const RequestRollUp = (props) => {

    const categoryColorMap = new Map([
        ["cleaning", "#32CD32"],
        ["wardrobe", "red"],
        ["plumbing", "#AFEEEE"],
        ["electrical", "yellow"],
        ["hvac", "purple"],
        ["security", "#9400D3"],
        ["handyman", "#EE4B2B"],
        ["patching", "yellow"],
        ["gardening", "green"],
        ["extermination", "teal"],
        ["eventing", "purple"],
        ["companionship", "#FF69B5"],
        ["grooming", "navy"],
        ["nursing", "green"],
        ["nannying", "cyan"],
        ["petcare", "brown"],
        ["wellness", "pink"],
        ["multiple", "white"],
    ]);

    const statusMap = new Map([
        [1, ["requested", "green"]],
        [2, ["partially taken", "blue"]],
        [3, ["fully taken", "yellow"]],
        [4, ["delivered", "darkblue"]],
        [5, ["reviewed", "grey"]],
        [6, ["sanctioned", "black"]],
        [7, ["disputed", "red"]],

    ]);


    const recurrenceMap = new Map([
        [1, ["Once", "green"]],
        [2, ["Monthly", "yellow"]],
        [3, ["Weekly", "blue"]],
        [4, ["Daily", "red"]],

    ]);


    const { store, actions } = useContext(Context);
    let { id, status, date, time, recurrence, quantity, provider_id, address_id, service_description_id, } = props.requestObject;
    let serviceCategory = null;

    // Pre-processing Props

    const shortenTimeFormat = (time) => {
        const [hour, minutes, _] = time.split(':');
        const paddedHour = hour.padStart(2, '0');
        return `${paddedHour}:${minutes}`;
    };

    const convertDateFormat = (longDateFormat) => {
        const date = new Date(longDateFormat);

        const formattedDate = new Intl.DateTimeFormat('en', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        }).format(date);

        return formattedDate;
    };

    const providerString = "details";
    let addressString = null;
    let servideString = null;

    const statusString = statusMap.get(status)[0].charAt(0).toUpperCase() + statusMap.get(status)[0].slice(1);
    const dateString = convertDateFormat(date);
    const timeString = shortenTimeFormat(time);
    const recurrenceString = recurrenceMap.get(recurrence)[0];

    if (store.userAddresses) {
        addressString = (store.userAddresses.id1 === address_id) ? "main address" : "secondary address"
    }

    if (store.serviceDescriptions) {
        const temporaryObject = store.serviceDescriptions.find(object => object.id === service_description_id);
        serviceCategory = temporaryObject ? temporaryObject.category : null;
        servideString = temporaryObject ? temporaryObject.service : "None";
    }

    // Main JSX
    return (
        <>
            <div className="container-fluid my-1">
                <div className="requestRollUp my-1" id={id}>
                    <div className="requestRollUpBanner">
                        <div className="rollUpColumns d-flex mx-0 px-0 g-0 vw-100">
                            <div className="rollUpColumn1 label2Wrapper">
                                <span className="rollUpLabel2Color" style={{ background: `${categoryColorMap.get(serviceCategory)}` }}>&nbsp;</span>
                                <span className="rollUpLabel2">{servideString}</span>
                            </div>
                            <div className="rollUpColunn2">
                                <span className="rollUpDescription">status:</span>
                            </div>
                            <div className="rollUpColumn3">
                                <span className="rollUpValue">{statusString}</span>
                            </div>
                            <div className="rollUpColumn4">
                                <span className="rollUpDescription">date:</span>
                            </div>
                            <div className="rollUpColumn5">
                                <span className="rollUpValue">{dateString}</span>
                            </div>
                            <div className="rollUpColumn6">
                                <span className="rollUpDescription">time:</span>
                            </div>
                            <div className="rollUpColumn7">
                                <span className="rollUpValue">{timeString}</span>
                            </div>
                            <div className="rollUpColumn8">
                                <span className="rollUpDescription">details</span>
                            </div>
                        </div>
                    </div>
                    <div className="requestExpandableWrapper" id={"requestExpandableWrapperId" + id}>
                        <div className="requestExpandable">
                            <div className="requestExpandableContent">
                                <p>
                                    dksjgdkfjgkdfjgkdfgkdflgdfjkghçdflkj
                                    12345668767876876876876
                                </p>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        </>

    );
};


