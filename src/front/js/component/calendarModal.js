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
    const handleClickCancel = () => {
        return true;
    }

    const closeCalendarModal = () => {
        const dialog = document.querySelector(`#dialog${id}`);
        dialog.close();
    }

    // Service Request function 

    const handleSendRequest = () => {
        actions.createServiceRequest(newServiceRequest);
        closeCalendarModal();
        actions.alertUser("service requested", "yellow", "black");
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

    // Hourpicker Subcomponent

    const HourPicker = () => {

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

        return (
            <>
                <div className="hourPickerWrapper">
                    <span className="pickerValue ">{newServiceRequest.time}</span>
                    <span className="pickerControls"><button onClick={handleIncreaseHour}>+</button></span>
                    <span className="pickerControls"><button onClick={handleDecreseHour}>-</button></span>
                </div>
            </>
        );
    }

    //quantityPIcker subcomponent

    const QuantityPicker = () => {

        const handleIncreaseRecurrence = () => {
            if (newServiceRequest.quantity === 5) { return false }

            let temporaryVariable = newServiceRequest.quantity + 1;
            setNewServiceRequest({ ...newServiceRequest, quantity: temporaryVariable });
            return true;
        }

        const handleDecreaseRecurrence = () => {
            if (newServiceRequest.quantity === 1) { return false }

            let temporaryVariable = newServiceRequest.quantity - 1;
            setNewServiceRequest({ ...newServiceRequest, quantity: temporaryVariable });
            return true;
        }

        return (
            <>
                <div className="quantityPicker">
                    <span className="pickerValue me-1">{newServiceRequest.quantity}</span>
                    <span className="pickerControls me-1"><button onClick={handleIncreaseRecurrence}>+</button></span>
                    <span className="pickerControls"><button onClick={handleDecreaseRecurrence}>-</button></span>
                </div>
            </>
        );

    };

    //repeatPicker subcomponent

    const RepeatPicker = () => {

        const recurrenceMap = new Map([
            [1, "No"],
            [2, "Monthly"],
            [3, "Weekly"],
            [4, "Daily"]
        ]);

        const handleIncreaseRecurrence = () => {
            if (newServiceRequest.recurrence === 4) { return false }

            let temporaryVariable = newServiceRequest.recurrence + 1;
            setNewServiceRequest({ ...newServiceRequest, recurrence: temporaryVariable });
            return true;
        }

        const handleDecreaseRecurrence = () => {
            if (newServiceRequest.recurrence === 1) { return false }

            let temporaryVariable = newServiceRequest.recurrence - 1;
            setNewServiceRequest({ ...newServiceRequest, recurrence: temporaryVariable });
            return true;
        }

        return (
            <>
                <div className="repeatPicker">
                    <span className="pickerValue me-1">{recurrenceMap.get(newServiceRequest.recurrence)}</span>
                    <span className="pickerControls me-1"><button onClick={handleIncreaseRecurrence}>+</button></span>
                    <span className="pickerControls"><button onClick={handleDecreaseRecurrence}>-</button></span>
                </div>
            </>
        );

    };


    //Recurrence picker

    const RecurrencePicker = () => {
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
                        no
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
    };

    // Address picker

    const AddressPicker = () => {
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
    };


    //CalendarModal JSX
    return (
        <>
            <dialog data-modal id={"dialog" + id} className="">
                <div className="calendarModalWrapper">
                    <div className=" d-flex justify-content-center align-items-center mt-0 pt-0">
                        <span className="modalTitle">book: {service.toLowerCase()}</span>
                    </div>
                    <div>
                        <div className="modalSubTitle d-flex justify-content-center mb-1">
                            <span className="me-1">
                                <svg className="p-0 m-0 g-0" xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h65v-60h65v60h340v-60h65v60h65q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-430H180v430Zm0-490h600v-130H180v130Zm0 0v-130 130Zm300 230q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" /></svg>
                            </span>
                            <span className="modalOptionTiltle m-0 ps-1 g-0 d-flex justify-content-start">
                                Date
                            </span>
                        </div>
                        <div className="calendarContainer">
                            <Calendar />
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-around mt-2 pe-1">
                        <div className="modalSubTitle d-flex justify-content-center">
                            <span className="me-1">
                                <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="m627-287 45-45-159-160v-201h-60v225l174 181ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-82 31.5-155t86-127.5Q252-817 325-848.5T480-880q82 0 155 31.5t127.5 86Q817-708 848.5-635T880-480q0 82-31.5 155t-86 127.5Q708-143 635-111.5T480-80Zm0-400Zm0 340q140 0 240-100t100-240q0-140-100-240T480-820q-140 0-240 100T140-480q0 140 100 240t240 100Z" /></svg>
                            </span>
                            <span className="modalOptionTiltle d-flex me-2">
                                Time:
                            </span>
                            <span className="itemContainer">
                                <HourPicker />
                            </span>
                        </div>
                        <div className="modalSubTitle d-flex">
                            <span className="me-1">
                                <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M286.788-81Q257-81 236-102.212q-21-21.213-21-51Q215-183 236.212-204q21.213-21 51-21Q317-225 338-203.788q21 21.213 21 51Q359-123 337.788-102q-21.213 21-51 21Zm400 0Q657-81 636-102.212q-21-21.213-21-51Q615-183 636.212-204q21.213-21 51-21Q717-225 738-203.788q21 21.213 21 51Q759-123 737.788-102q-21.213 21-51 21ZM235-741l110 228h288l125-228H235Zm-30-60h589.074q22.964 0 34.945 21Q841-759 829-738L694-495q-11 19-28.559 30.5Q647.881-453 627-453H324l-56 104h491v60H277q-42 0-60.5-28t.5-63l64-118-152-322H51v-60h117l37 79Zm140 288h288-288Z" /></svg>
                            </span>
                            <span className="modalOptionTiltle d-flex me-2">
                                Quantity:
                            </span>
                            <span className="itemContainer">
                                <QuantityPicker />
                            </span>
                        </div>

                    </div>
                    <div className="modalSubTitle d-flex justify-content-center mt-1 mb-1">
                        <span className="me-1">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-80q-75 0-140.5-28T225-185q-49-49-77-114.5T120-440h60q0 125 87.5 212.5T480-140q125 0 212.5-87.5T780-440q0-125-85-212.5T485-740h-23l73 73-41 42-147-147 147-147 41 41-78 78h23q75 0 140.5 28T735-695q49 49 77 114.5T840-440q0 75-28 140.5T735-185q-49 49-114.5 77T480-80Z" /></svg>
                        </span>
                        <span className="modalOptionTiltle d-flex me-2">
                            Repeat:
                        </span>
                        <span className="calendarContainer">
                            <RepeatPicker />
                        </span>
                    </div>
                    <div className="modalSubTitle d-flex justify-content-center mt-1 mb-1">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M220-180h150v-250h220v250h150v-390L480-765 220-570v390Zm-60 60v-480l320-240 320 240v480H530v-250H430v250H160Zm320-353Z" /></svg>
                        </span>
                        <span className="modalOptionTiltle m-0 ps-1 g-0 d-flex justify-content-start">
                            Address:
                        </span>
                        <span className="calendarContainer">
                            <AddressPicker />
                        </span>
                    </div>
                    <button onClick={handleSendRequest}>SEND REQUEST</button>
                    <div>
                        <input className="expand-toggle" id={`expand-toggle${id}`} type="checkbox" />
                        <label htmlFor={`expand-toggle${id}`} className="expand-label">review and confirm</label>
                        <div className="expand-content">
                            <div>Order summary</div>
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