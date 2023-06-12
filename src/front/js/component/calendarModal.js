import React, { useState } from "react";

export const CalendarModal = (props) => {
    const { id, service } = props
    const [serviceSelectedDate, setServiceSelectedDate] = useState("");

    const handleClickCancel = () => {
        return true;
    }

    const Calendar = () => {
        const cellStyle = {
            textAlign: 'center',
            height: '1.6rrem',
            width: '2.1rem',
            margin: '0px',
            padding: '0px',
            fontSize: '.675rem',
            borderBottom: '.7px solid black',
            borderCollapse: "collapse",
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

        for (let i = 0; i < 4; i++) {
            const weekStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i * 7);
            const week = [];
            for (let j = 0; j < 7; j++) {
                const day = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + j);
                const dayOfMonth = day.getDate();

                const previousDate = new Date(currentDate);
                previousDate.setDate(currentDate.getDate() - 1);

                const isUnviableDay = (day < previousDate) || (i === 3 && j > currentDate.getDay());
                const isCurrentDay = day.getDate() === currentDate.getDate() && day.getMonth() === currentDate.getMonth() && day.getFullYear() === currentDate.getFullYear();
                const buttonClassName = `calendarDays ${isUnviableDay ? "unviableDay" : "viableDay"} ${isCurrentDay ? "currentDay" : ""}`;
                
                const cell = (
                    <button
                        key={`${i}-${j}`}
                        style={cellStyle}
                        className={buttonClassName}
                        onClick={() => setServiceSelectedDate(new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1).toISOString().split('T')[0])}
                        disabled={buttonClassName.includes('unviableDay')}
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
            <dialog data-modal className="">
                <div>
                    <Calendar />
                </div>
                <div>
                    Service date: {serviceSelectedDate}
                </div>
                <div>
                    <form method="dialog">
                        <button onClick={(handleClickCancel)}>Cancel</button>
                    </form>

                    <input className="expand-toggle" id={`expand-toggle${id}`} type="checkbox" />
                    <label htmlFor={`expand-toggle${id}`} className="expand-label">Toggle</label>
                    <div className="expand-content">
                        Invisible content to expand
                    </div>
                </div>
            </dialog>

        </>

    );
}