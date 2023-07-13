import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const ProviderServiceSettings = () => {
  const { store, actions } = useContext(Context);

  const [newServiceRadius, setNewServiceRadius] = useState(null);
  const [newAvailabilityMatrix, setNewAvailabilityMatrix] = useState([]);

  const experienceMap = new Map([
    [1, "1 year"],
    [2, "1 to 3 years"],
    [3, "over 3 years"],
  ]);

  const timeslotMap = new Map([
    [1, "M"],
    [2, "A"],
    [3, "E"],
  ])
  // useEffects

  useEffect(() => {
    if (store.providerSettings) {
      setNewServiceRadius(store.providerSettings.service_radius);
    }
  }, [store.providerSettings]);


  useEffect(() => {
    if (store.providerAvaiabilities && store.providerAvailabilityMatrix) {
      setNewAvailabilityMatrix(store.providerAvailabilityMatrix);
    }
  }, [store.providerAvaiabilities, store.providerAvailabilityMatrix]);


  // Handle Functions

  const handleIncreaseRadius = () => {
    setNewServiceRadius((value) => value = value + 1)
  }

  const handleDecreaseRadius = () => {
    if (newServiceRadius === 5) { return }
    else {
      setNewServiceRadius((value) => value = value - 1)
    }
  }

  const handleUpdateServieRadius = () => {
    actions.updateServiceRadius(newServiceRadius);
  }

  // Availabity Calendar
  // Matrix rotated 90 degrees. Rows and COlumns have to be switched

  const handleToggleAvailability = (rowIndex, columnIndex) => {
    const updatedMatrix = [...newAvailabilityMatrix];
    updatedMatrix[columnIndex][rowIndex] = !newAvailabilityMatrix[columnIndex][rowIndex];
    setNewAvailabilityMatrix(updatedMatrix);
  }

  const handleActivateAllAvailabilities = () => {
    const auxiliaryMatrix = [
      [true, true, true],
      [true, true, true],
      [true, true, true],
      [true, true, true],
      [true, true, true],
      [true, true, true],
      [true, true, true],
    ]

    setNewAvailabilityMatrix(auxiliaryMatrix);
  }

  const handleResetAllAvailabilities = () => {
    const auxiliaryMatrix = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
      [false, false, false],
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ]
    setNewAvailabilityMatrix(auxiliaryMatrix);
  }

  const handleInvertAllAvailabilities = () => {
    const auxiliaryMArix = [...newAvailabilityMatrix];
    const invertedMatrix = auxiliaryMArix.map(row => row.map(cell => !cell));
    setNewAvailabilityMatrix(invertedMatrix);
  };

  // handleUpdateAvailability

  const handleAvailabilityUpdate = () => {
    let availabilityObjectArray = [];

    if (newAvailabilityMatrix) {
      for (let row = 0; row < newAvailabilityMatrix.length; row++) {
        for (let column = 0; column < 3; column++) {
          let availabilityObject = {}
          if (newAvailabilityMatrix[row][column]) {
            if (row === 0) { availabilityObject.day = 6 }
            else { availabilityObject.day = row - 1; }
            availabilityObject.time_slot = column + 1;
            availabilityObjectArray.push(availabilityObject);
          }
        }
      }
    }
  
    actions.updateProviderAvailability(availabilityObjectArray)
  
  }

  // Subcomponents

  const StarRatingPicker = () => {
    const providerRating = store.providerSettings?.average_rating;

    const renderStar = (indexOfStar) => {
      const roundedRating = Math.floor(providerRating * 2) / 2; // Round down the rating to the nearest half star

      if (indexOfStar <= roundedRating) {
        return (
          <span className="filled-star">
            <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14">
              <path d="m233-80 65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z" />
            </svg>
          </span>
        );
      } else if (indexOfStar === roundedRating + 0.5) {
        return (
          <span className="half-filled-star">
            <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14">
              <path d="m480-299 157 95-42-178 138-120-182-16-71-168v387ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z" />
            </svg>
          </span>
        );
      } else {
        return (
          <span className="empty-star">
            <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14">
              <path d="m323-205 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Zm247-355Z" />
            </svg>
          </span>
        );
      }
    };

    return (
      <div className="star-rating">
        {store.providerSettings && providerRating && [1, 2, 3, 4, 5].map((index) => (
          <span key={index}>{renderStar(index)}</span>
        ))}
      </div>
    );
  };

  // Availability CAlendar

  const AvailabilityCalendar = () => {
    return (
      <div>
        {newAvailabilityMatrix && (
          <table className="availabilityTable">
            <thead>
              <tr>
                <th></th>
                <th className="availabilityAbbreviations">sun</th>
                <th className="availabilityAbbreviations">mon</th>
                <th className="availabilityAbbreviations">tue</th>
                <th className="availabilityAbbreviations">wed</th>
                <th className="availabilityAbbreviations">thu</th>
                <th className="availabilityAbbreviations">fri</th>
                <th className="availabilityAbbreviations">sat</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map((rowIndex) => (
                <tr
                  key={rowIndex}>
                  <td className="timeSlotAbbreviations"></td>
                  {newAvailabilityMatrix.map((dayAvailability, columnIndex) => (
                    <td
                      key={columnIndex}
                      className="availabilityAbbreviations"
                      style={{
                        width: ".9rem",
                        minWidth: ".9rem",
                        height: ".7rem",
                        minHeight: ".7rem",
                        padding: "0",
                        textAlign: "center",
                        verticalAlign: "middle",
                        border: ".7px solid black",
                        borderCollapse: "collapse",
                        padding: "0",
                        margin: "0",
                        gap: "0",

                      }}
                    >
                      <button
                        onClick={() => {
                          handleToggleAvailability(rowIndex, columnIndex);
                        }}
                        className={dayAvailability[rowIndex] ? "availabilityTimeSlot unavaiableTimeSlot" : "availabilityTimeSlot avaiableTimeSlot"}

                      >
                        1
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  // Pre-processing Props

  const averageRating = store.providerSettings?.average_rating;
  const ratingString = averageRating ? averageRating.toFixed(2).padStart(4, '0') : "";
  const ratingsCounter = store.providerSettings?.ratings_counter;
  const ratingsCounterString = ratingsCounter ? (ratingsCounter == 1 ? " - 1 rating" : " - " + ratingsCounter + " ratings") : "";

  // Main JSX
  return (
    <>
      <div className="container-fluid mb-5 ms-3">
        <div className="mt-2">
          <span className="settingsTitles">certified:</span>
          <span>
            <span className="settingsControl1 ms-1">
              {store.providerSettings && store.providerSettings.has_certificate &&
                (store.providerSettings.has_certificate ?
                  (<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z" /></svg>)
                  :
                  (<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z" /></svg>)
                )
              }
            </span>
          </span>
        </div>
        <div className="mt-1">
          <span className="settingsTitles">
            experience:
          </span>
          <span className="settingsValue ms-1">
            {store.providerSettings && store.providerSettings.experience && (
              experienceMap.get(store.providerSettings.experience)
            )}
          </span>
        </div>
        <div className="mt-1 d-flex">
          <span className="settingsTitles settingsRatingLabel">rating:</span>
          <span className="ms-1 "><StarRatingPicker /></span>
        </div>
        <div>
          <span className="settingsValue">{ratingString}</span>
          <span className="settingsValue ms-1">{ratingsCounterString}</span>
        </div>
        <div className="mt-3">
        </div>
        <div>
          <span className="settingsTitles settingsRatingLabel">service radius:</span>
          <span className="settingsValue ms-1 ">{newServiceRadius}</span>
          <span>
            <button className="settingsControl3 clickable" onClick={handleIncreaseRadius}>+</button>
          </span>
          <span>
            <button className="settingsControl4 clickable" onClick={handleDecreaseRadius}>-</button>
          </span>
        </div>
        <div className="mt-3">
          <button onClick={handleUpdateServieRadius} className="updateettingsButton">update radius</button>
        </div>
        <div className="mt-3">
          <AvailabilityCalendar />
        </div>
        <div>
          <span>
            <button
              onClick={handleActivateAllAvailabilities}
            >
              <svg className="clickable" xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 -960 960 960" width="12"><path d="M450-438v-406h60v406h-60Zm30 320q-74 0-139.5-28.5T226-224q-49-49-77.5-114.5T120-478q0-80 34-149.5T250-751l42 42q-53 43-82.5 102.5T180-478.022Q180-353 267.5-265.5 355-178 480-178q125.357 0 212.679-87.5Q780-353 780-478.022 780-547 750.5-607.5 721-668 670-709l43-42q60 51 93.5 122T840-478q0 74-28.5 139.5t-77 114.5q-48.5 49-114 77.5T480-118Z" /></svg>
            </button>
            <button
              onClick={handleResetAllAvailabilities}

            >
              <svg className="clickable" xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 -960 960 960" width="12"><path d="M382-120v-118L240-394v-215q0-25 17-42.5t41-17.5l60 60h-58v191l142 155.701V-180h76v-82l49-54L67-816l42-42 750 750-42 42-207-207-32 35v118H382Zm310-240-32-32v-217H443L342-710v-130h60v171h156v-171h60v201l-30-30h72q24.75 0 42.375 17.625T720-609v217l-28 32ZM553-499Zm-114 55Z" /></svg>
            </button>
            <button
              onClick={handleInvertAllAvailabilities}
            >
              <svg className="clickable" xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 -960 960 960" width="12"><path d="M480-120q-132 0-226-91.5T160-435q0-66 25-122.5T254-658l226-222 226 222q44 44 69 100.5T800-435q0 131-93.5 223T480-120Zm0-60v-616L294-613q-36 36-55 80t-19 98q0 107 76.5 181T480-180Z" /></svg>
            </button>
          </span>
        </div>
        <div>
          <button onClick={handleAvailabilityUpdate} className="updateettingsButton">update availability</button>

        </div>

      </div>
    </>
  );
};



  // Avaiability Calendar compoenent
/* 
  const AvailabilityCalendar = () => {

    const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const timeSlots = ["1", "2", "3"];
  
    const handleToggleAvailability = (x, y) => {
      const updatedMatrix = [...newAvailabilityMatrix];
      updatedMatrix[x][y] = !updatedMatrix[x][y];
      setNewAvailabilityMatrix(updatedMatrix);
    };
  
    return (
      <div>
        <table className="avaiabilityTable">
          <thead>
            <tr>
              <th></th>
              {daysOfWeek.map((day, index) => (
                <th className="availabilityAbbreviations" key={index}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot, rowIndex) => (
              <tr key={rowIndex}>
                <td className="availabilityAbbreviations">{timeSlot}</td>
                {newAvailabilityMatrix.map((row, columnIndex) => (
                  <td
                    key={columnIndex}
                    style={{
                      padding: "0",
                      width: "1rem",
                      height: ".7rem",
                      background: "red",
                    }}
                  >
                    <button
                      onClick={() => handleToggleAvailability(columnIndex, rowIndex)}
                      className={row[rowIndex] === 1 ? "selectedAvailabilityCell" : "selectedAvailabilityCell"}
                    >
                        {row[rowIndex] === 1 ? "1" : "0"}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
      
 */