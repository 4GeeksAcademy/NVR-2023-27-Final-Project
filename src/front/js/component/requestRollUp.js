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
        [0, ["untaken", "red"]],
        [1, ["requested", "green"]],
        [2, ["taken", "blue"]],
        [3, ["safeguarded", "yellow"]],
        [4, ["provided", "darkblue"]],
        [5, ["renewed", "grey"]],
        [6, ["reviewed", "black"]],
        [7, ["sanctioned", "red"]],

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
                        <div className="requestRollUpColumns d-flex mx-0 px-0 g-0 vw-100">
                            <div className="requestRollUpColumn1 d-flex justify-content-end">
                                <div className="requestRollUpTitleWrapper">
                                    <span className="requestRollUpTitleLabel">{servideString}</span>
                                </div>
                            </div>
                            <div className="requestRollUpColunn2">
                                <span className="rollUpDescription">status:</span>
                            </div>
                            <div className="requestRollUpColumn3">
                                <span className="rollUpValue">{statusString}</span>
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


{/* <span className="" style={{ background: `${categoryColorMap.get(serviceCategory)}` }}>&nbsp;</span> */ }


{/* <span className="">
<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="m627-287 45-45-159-160v-201h-60v225l174 181ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-82 31.5-155t86-127.5Q252-817 325-848.5T480-880q82 0 155 31.5t127.5 86Q817-708 848.5-635T880-480q0 82-31.5 155t-86 127.5Q708-143 635-111.5T480-80Zm0-400Zm0 340q140 0 240-100t100-240q0-140-100-240T480-820q-140 0-240 100T140-480q0 140 100 240t240 100Z" /></svg>
</span>

<span className="">
<svg className="" xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h65v-60h65v60h340v-60h65v60h65q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-430H180v430Zm0-490h600v-130H180v130Zm0 0v-130 130Zm300 230q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" /></svg>
</span>

<span className="">
<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M286.788-81Q257-81 236-102.212q-21-21.213-21-51Q215-183 236.212-204q21.213-21 51-21Q317-225 338-203.788q21 21.213 21 51Q359-123 337.788-102q-21.213 21-51 21Zm400 0Q657-81 636-102.212q-21-21.213-21-51Q615-183 636.212-204q21.213-21 51-21Q717-225 738-203.788q21 21.213 21 51Q759-123 737.788-102q-21.213 21-51 21ZM235-741l110 228h288l125-228H235Zm-30-60h589.074q22.964 0 34.945 21Q841-759 829-738L694-495q-11 19-28.559 30.5Q647.881-453 627-453H324l-56 104h491v60H277q-42 0-60.5-28t.5-63l64-118-152-322H51v-60h117l37 79Zm140 288h288-288Z" /></svg>
</span>

<span>
    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M220-180h150v-250h220v250h150v-390L480-765 220-570v390Zm-60 60v-480l320-240 320 240v480H530v-250H430v250H160Zm320-353Z" /></svg>
</span> */}

{/* <span className="">
<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-80q-75 0-140.5-28T225-185q-49-49-77-114.5T120-440h60q0 125 87.5 212.5T480-140q125 0 212.5-87.5T780-440q0-125-85-212.5T485-740h-23l73 73-41 42-147-147 147-147 41 41-78 78h23q75 0 140.5 28T735-695q49 49 77 114.5T840-440q0 75-28 140.5T735-185q-49 49-114.5 77T480-80Z" /></svg>
</span> */}