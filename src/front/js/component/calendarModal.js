import React, { useState } from "react";

export const CalendarModal = (props) => {
    const { id, service, price } = props
    console.log(id, service);
    const [serviceSelectedDate, setServiceSelectedDate] = useState("");

    const getExtendedDateString = (dateString) => {
        const date = new Date(dateString);
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const handleClickCancel = () => {
        return true;
    }

    const Calendar = () => {
        const cellStyle = {
            textAlign: 'center',
            height: '1.4rrem',
            width: '1.8rem',
            margin: '0px',
            padding: '0px',
            fontSize: '.675rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        };

        const containerStyle = {
            display: 'flex',
            flexDirection: 'row',
        };

        const currentDate = new Date();
        const startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - currentDate.getDay());
        const weekdayAbbreviations = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

        const weeks = [];
        weeks.push(
            <div key="weekdays" className="calendarContainer">
                {weekdayAbbreviations.map((day, index) => (
                    <div key={index} className="weekDaysAbbreviations" style={cellStyle}>
                        {day}
                    </div>
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

                const isUnviableDay = (day < previousDate) || (i === 4 && j > currentDate.getDay());
                const isCurrentDay = day.getDate() === currentDate.getDate() && day.getMonth() === currentDate.getMonth() && day.getFullYear() === currentDate.getFullYear();
                const buttonClassName = `calendarDays ${isUnviableDay ? "unviableDay" : "viableDay"} ${isCurrentDay ? "currentDay" : ""}`;

                const cell = (
                    <button
                        key={`${i}-${j}`}
                        style={cellStyle}
                        className={buttonClassName}
                        onClick={() => {
                            setServiceSelectedDate(new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1).toISOString().split('T')[0])
                        }
                        }
                        disabled={buttonClassName.includes("unviableDay")}
                    >
                        {dayOfMonth}
                    </button>
                );
                week.push(cell);
            }
            weeks.push(<div key={i} style={containerStyle}>{week}</div>);
        }

        return <div className="calendarWrapper">{weeks}</div>;
    };

    //CalendarModal JSX
    return (
        <>
            <dialog data-modal id={"dialog" + id} className="">
            
                <div className="menuLabel d-flex justify-content-center align-items-center">
                    book {service.toLowerCase()}
                    <span>
                    <form method="dialog">
                        <button onClick={(handleClickCancel)}>
                            <span className="cancelModal">
                                <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="48"><path d="m336-294 144-144 144 144 42-42-144-144 144-144-42-42-144 144-144-144-42 42 144 144-144 144 42 42ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z" /></svg>
                            </span>
                        </button>
                    </form>
                </span>
                </div>
                <div>
                    <Calendar />
                </div>
                <div>
                    Service date: {getExtendedDateString(serviceSelectedDate)}
                </div>
                <div>
                    <input className="expand-toggle" id={`expand-toggle${id}`} type="checkbox" />
                    <label htmlFor={`expand-toggle${id}`} className="expand-label">Toggle</label>
                    <div className="expand-content">
                        Invisible content to expand
                    </div>
                </div>
                <p>
                    {id}
                </p>
                <p>
                    {service}
                </p>
                <p>
                    {price}
                </p>
            </dialog>

        </>

    );
}