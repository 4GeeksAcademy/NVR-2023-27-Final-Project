import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const CalendarModal = (props) => {

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
    let categoryColor = "transparent";

    const recurrenceMap = new Map([
        [1, "Once"],
        [2, "Monthly"],
        [3, "Weekly"],
        [4, "Daily"]
    ]);

    // General variables
    const { store, actions } = useContext(Context);
    const { id, service, price } = props



    // Stes default Request day to the day after teh current day
    const currentDate = new Date();
    const nextDay = new Date();
    nextDay.setDate(currentDate.getDate() + 1);

    // Generates dateString
    const year = nextDay.getFullYear();
    const month = String(nextDay.getMonth() + 1).padStart(2, '0');
    const day = String(nextDay.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const [newServiceRequest, setNewServiceRequest] = useState({
        status: 1,
        date: dateString,
        time: "09:00",
        recurrence: 1,
        quantity: 1,
        service_description_id: id,
        user_id: store.credentials.id,
        provider_id: null,
        address_id: null,
    });

    // initialzies newServiceRequest wuth main address ID
    useEffect(() => {
        if (store.userAddresses) {
            setNewServiceRequest({ ...newServiceRequest, address_id: store.userAddresses.id1 })
        }
    }, [store.userAddresses]);

    // General functions

    const formatDate = (inputDate) => {
        const [year, month, day] = inputDate.split('-');
        const formattedDate = `${month}-${day}-${year.slice(2)}`;
        return formattedDate;
    };

    const handleCloseCalendarModal = () => {
        const dialog = document.querySelector(`#dialog${id}`);
        dialog.close();
    }

    // Service Request function 

    const handleCewateServiceRequest = () => {
        actions.createServiceRequest(newServiceRequest);
        handleCloseCalendarModal();
    };

    // Calendar Subcomponent
    const Calendar = () => {

        const handleDateClick = (newDate) => {
            setNewServiceRequest((prevState) => ({
                ...prevState,
                date: newDate,
            }));
        };

        const currentDate = new Date();
        const startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - currentDate.getDay());

        const weekdayAbbreviations = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const weeks = [];
        weeks.push(
            <div key="weekdays" className="calendarAbbreviationsContainer">
                {weekdayAbbreviations.map((day, index) => (
                    <>
                        <span className="adjacentCell">■</span>
                        <div key={index} className="weekDaysAbbreviations calendarCell">
                            {day}
                        </div>
                    </>
                ))}
            </div>
        );

        for (let i = 0; i < 5; i++) {
            const weekStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i * 7);
            const week = [];
            for (let j = 0; j < 7; j++) {
                const day = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + j);
                const dayOfMonth = day.getDate();
                const previousDate = new Date(currentDate);
                previousDate.setDate(currentDate.getDate() - 1);

                const newDateString = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1).toISOString().split('T')[0];
                const isUnviableDay = (day < previousDate) || (i === 4 && j > currentDate.getDay());
                const isCurrentDay = day.getDate() === currentDate.getDate() && day.getMonth() === currentDate.getMonth() && day.getFullYear() === currentDate.getFullYear();
                const isSelectedServiceDay = (newServiceRequest.date === newDateString);
                let isBookedDay = null;

                // Checks if day of calendar is booked already with some otehr service
                if (
                    store.userBookedDays &&
                    store.userBookedDays.some((booking) => booking.date === newDateString)
                ) {
                    isBookedDay = true;
                    const booking = store.userBookedDays.find((booking) => booking.date === newDateString);
                    categoryColor = categoryColorMap.get(booking.category);
                }

                const buttonClassName = `calendarCell ${isUnviableDay ? "unviableDay" : "viableDay"
                    } ${isCurrentDay ? "currentDay" : ""} ${isBookedDay ? "bookedDay" : ""} ${isSelectedServiceDay ? "selectedRequestDay" : ""}`;

                const cell = (
                    <>
                        <span className="adjacentCell" style={{ color: isBookedDay ? categoryColor : "transparent" }}>■</span>
                        <button
                            key={`${i}-${j}`}
                            id={`cell${i}-${j}`}
                            className={buttonClassName}
                            onClick={() => handleDateClick(newDateString)}
                            disabled={buttonClassName.includes("unviableDay")}
                        >
                            {dayOfMonth}
                        </button>
                    </>
                );
                week.push(cell);
            }
            weeks.push(<div key={i} className="weekContainer">{week}</div>);
        }

        return (
            <div className="calendarWrapper">
                {weeks}
            </div>
        );
    };

    // Hour handle functions

    const handleIncreaseHour = () => {
        const serviceHour = newServiceRequest.time;
        if (serviceHour === "22:00") {
            return true;
        }

        let hours = parseInt(serviceHour.charAt(0) + serviceHour.charAt(1));
        let halfHours = parseInt(serviceHour.charAt(3) + serviceHour.charAt(4));

        if (!halfHours) {
            halfHours = 30;
        } else {
            halfHours = 0;
            hours++;
        }
        const hourString = hours.toString().padStart(2, "0") + ":" + halfHours.toString().padEnd(2, "0");
        setNewServiceRequest({ ...newServiceRequest, time: hourString });
    };

    const handleDecreseHour = () => {
        const serviceHour = newServiceRequest.time;
        if (serviceHour === "07:00") {
            return true;
        }

        let hours = parseInt(serviceHour.charAt(0) + serviceHour.charAt(1));
        let halfHours = parseInt(serviceHour.charAt(3) + serviceHour.charAt(4));

        if (!halfHours) {
            halfHours = 30;
        } else {
            halfHours = 0;
            hours--;
        }

        const hourString = hours.toString().padStart(2, "0") + ":" + halfHours.toString().padEnd(2, "0");
        setNewServiceRequest({ ...newServiceRequest, time: hourString });
    };


    // Quantity handle functions

    const handleIncreaseQuantity = () => {
        if (newServiceRequest.quantity === 3) {

            setNewServiceRequest({ ...newServiceRequest, quantity: 1 });
            return true;

        }

        let temporaryVariable = newServiceRequest.quantity + 1;
        setNewServiceRequest({ ...newServiceRequest, quantity: temporaryVariable });
        return true;
    }

    // Recurrence handle functions

    const handleIncreaseRecurrence = () => {
        if (newServiceRequest.recurrence === 4) {
            setNewServiceRequest({ ...newServiceRequest, recurrence: 1 });
            return true
        }

        let temporaryVariable = newServiceRequest.recurrence + 1;
        setNewServiceRequest({ ...newServiceRequest, recurrence: temporaryVariable });
        return true;
    }

    // Address toggle

    const handleAddressToggle = () => {
        const hasSecondaryAddress = store.userAddresses && store.userAddresses.id2;
        const addressId = (hasSecondaryAddress) ? (newServiceRequest.address_id === store.userAddresses.id1 ? store.userAddresses.id2 : store.userAddresses.id1) : store.userAddresses.id1;
        setNewServiceRequest((prevState) => ({
            ...prevState,
            address_id: addressId,
        }));
    };

    const getTypeOfAddress = () => {
        if (store.userAddresses) {
            if (newServiceRequest.address_id === store.userAddresses.id1) { return "Main" }
            else return "Second";
        }
        return "";
    }

    const DismissIcon = <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="m336-294 144-144 144 144 42-42-144-144 144-144-42-42-144 144-144-144-42 42 144 144-144 144 42 42ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z" /></svg>


    //CalendarModal JSX

    return (
        <>
            <dialog data-modal id={"dialog" + id} className="largeDialogElement">
                <div className="calendarModalWrapper my-3">
                    <div>
                        <div className="calendarContainer">
                            <Calendar />
                        </div>
                    </div>
                    <div className="container-fluid mt-3">
                        <div className="justify-content-center">
                            <table className="calendarModalTable">
                                <tbody>
                                    <tr>
                                        <td className="calendarModalTableLabel">date:</td>
                                        <td className="calendarModalTableValue">{formatDate(newServiceRequest.date)}</td>
                                        <td></td>
                                        <td></td>
                                        <td>&nbsp;</td>
                                        <td className="calendarModalTableLabel">time:</td>
                                        <td className="calendarModalTableValue">{newServiceRequest.time}</td>
                                        <td className="pickerButton"><button onClick={handleIncreaseHour}>+</button></td>
                                        <td className="pickerButton"><button onClick={handleDecreseHour}>-</button></td>
                                    </tr>
                                    <tr>
                                        <td className="calendarModalTableLabel">book:</td>
                                        <td className="calendarModalTableValue">{recurrenceMap.get(newServiceRequest.recurrence)}</td>
                                        <td className="pickerButton"><button onClick={handleIncreaseRecurrence}>+</button></td>
                                        <td></td>
                                        <td>&nbsp;</td>
                                        <td className="calendarModalTableLabel">address:</td>
                                        <td className="calendarModalTableValue">{getTypeOfAddress()}</td>
                                        <td className="pickerButton"><button onClick={handleAddressToggle}>+</button></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td className="calendarModalTableLabel">quantity:</td>
                                        <td className="calendarModalTableValue">{newServiceRequest.quantity}</td>
                                        <td className="pickerButton"><button onClick={handleIncreaseQuantity}>+</button></td>
                                        <td className="pickerButton"></td>
                                        <td>&nbsp;</td>
                                        <td className="calendarModalTableLabel">subtotal:</td>
                                        <td className="calendarModalTableValue">
                                            {newServiceRequest.quantity * price}.00€
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="container-fluid mt-4 mb-2">
                                <div className="row d-flex justify-content-center">
                                    <button onClick={handleCloseCalendarModal} className="cancelButton me-2 ">cancel</button>
                                    <button onClick={handleCewateServiceRequest} className="modalBookButton">book {service.toLowerCase()}</button>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </dialog >
        </>
    );
}



{/*   <form method="dialog">
                        <button className="dismissModalButton" onClick={(handleClickCancel)}>
                            <span className="cancelModal">
                                <svg className="p-0 m-0 g-0" xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="48"><path d="m336-294 144-144 144 144 42-42-144-144 144-144-42-42-144 144-144-144-42 42 144 144-144 144 42 42ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z" /></svg>
                            </span>
                        </button>
                    </form> */}

{/*    <span>
                    * 1: {newServiceRequest.status} *
                </span>
                <span>
                    * 2: {newServiceRequest.date} *
                </span>
                <span>
                    * 3: {newServiceRequest.time} *
                </span>
                <span>
                    * 4: {newServiceRequest.recurrence} *
                </span>
                <span>
                    * 5: {newServiceRequest.quantity} *
                </span>
                <span>
                    * 6: {newServiceRequest.service_description_id} *
                </span>
                <span>
                    * 7: {newServiceRequest.user_id} *
                </span>
                <span>
                    * 8: {newServiceRequest.provider_id} *
                </span>
                <span>
                    * 9: {newServiceRequest.address_id} *
                </span> */}

{/*   <div className="subtotal">
                        <span>subtotal:</span><span>{price * newServiceRequest.quantity}.00€</span>
                    </div> */}
{/* 

<div className="">
                                <span className="me-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-80q-75 0-140.5-28T225-185q-49-49-77-114.5T120-440h60q0 125 87.5 212.5T480-140q125 0 212.5-87.5T780-440q0-125-85-212.5T485-740h-23l73 73-41 42-147-147 147-147 41 41-78 78h23q75 0 140.5 28T735-695q49 49 77 114.5T840-440q0 75-28 140.5T735-185q-49 49-114.5 77T480-80Z" /></svg>
                                </span>
                                <span className="modalOptionTiltle d-flex me-2">
                                    Book:
                                </span>
                            </div> */}


// Address picker

/*     const AddressPicker = () => {
        const handleAddressChange = (addressId) => {
            setNewServiceRequest((prevState) => ({
                ...prevState,
                address_id: addressId,
            }));
        };
        return (
            <>
                <div className="address-buttons">

                    {store.userAddresses && store.userAddresses.id1 && (
                        <button
                            className={`address-button ${newServiceRequest.address_id === store.userAddresses.id1 ? 'activeAddressButton' : 'inactiveAddressButton'}`}
                            onClick={() => handleAddressChange(store.userAddresses.id1)}
                        >
                            main
                        </button>
                    )}
                    {store.userAddresses && store.userAddresses.id2 && (
                        <button
                            className={`address-button ${newServiceRequest.address_id === store.userAddresses.id2 ? 'activeAddressButton' : 'inactiveAddressButton'}`}
                            onClick={() => handleAddressChange(store.userAddresses.id2)}
                        >
                            second
                        </button>
                    )}
                </div>
            </>
        );
    }; */

//Recurrence picker
/* const RecurrencePicker = () => {
    const handleOptionChange = (event) => {
        const newRecurrence = parseInt(event.target.value);
        setNewServiceRequest((prevState) => ({
            ...prevState,
            recurrence: newRecurrence,
        }));
    };

    return (
        <>
            <div className="recurrence-buttons">
                <button
                    className={`recurrence-button ${newServiceRequest.recurrence === 1 ? 'activeRecurrence' : 'inactiveRecurrence'}`}
                    onClick={handleOptionChange}
                    value={1}
                >
                    once
                </button>
                <button
                    className={`recurrence-button ${newServiceRequest.recurrence === 2 ? 'activeRecurrence' : 'inactiveRecurrence'}`}
                    onClick={handleOptionChange}
                    value={2}
                >
                    monthly
                </button>
                <button
                    className={`recurrence-button ${newServiceRequest.recurrence === 3 ? 'activeRecurrence' : 'inactiveRecurrence'}`}
                    onClick={handleOptionChange}
                    value={3}
                >
                    weekly
                </button>
                <button
                    className={`recurrence-button ${newServiceRequest.recurrence === 4 ? 'activeRecurrence' : 'inactiveRecurrence'}`}
                    onClick={handleOptionChange}
                    value={4}
                >
                    daily
                </button>
            </div>
        </>
    );
}; */



{/*  <div className="cardBody ">
                                <div className="cardLabels">
                                    <div>date:</div>
                                    <div>time:</div>
                                    <div>quantity:</div>
                                    <div>book:</div>
                                    <div>address:</div>
                                </div>
                                <div className="cardInfo">
                                    <div className="">{newServiceRequest.date}</div>
                                    <div className="">{newServiceRequest.time}</div>
                                    <div className="">
                                        <span className="">{newServiceRequest.quantity}</span>
                                        <span className="modalPriceTag">{price * newServiceRequest.quantity}</span>
                                    </div>
                                    <div className="">{recurrenceMap.get(newServiceRequest.recurrence)}</div>
                                    <div className="">{getTypeOfAddress()}</div>
                                </div>
                                <div className="cardInfo">
                                    <div className="">123456</div>
                                    <div className=""> <HourPicker /></div>
                                    <div className=""> <QuantityPicker /></div>
                                    <div className=""> <RecurrencePicker /></div>
                                    <div className=""><AddressPicker /></div>
                                </div>
                            </div> */}

                            // <button onClick={handleCloseCalendarModal} className="me-2 cancelButton">cancel</button>
