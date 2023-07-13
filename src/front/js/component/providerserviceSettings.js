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
    [1, "AM"],
    [2, "PM"],
    [3, "EVE"],
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
    setNewServiceRadius((value) => value = value +1)
  }

  const handleDecreaseRadius = () => {
    if (newServiceRadius === 5 ) {return}
    else {
      setNewServiceRadius((value) => value = value -1)
    }
  }

    const handleUpdateServieRadius = () => {
      actions.updateServiceRadius(newServiceRadius);
    }

    // Matrix rotated 90 degrees. Rows and COlumns have to be switched
    const handleToggleAvailability = (rowIndex, columnIndex) => {
      const updatedMatrix = [...newAvailabilityMatrix]; 
      updatedMatrix[columnIndex][rowIndex] = !newAvailabilityMatrix[columnIndex][rowIndex];
    setNewAvailabilityMatrix(updatedMatrix);
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
                <tr key={rowIndex}>
                  <td className="availabilityAbbreviations">{rowIndex + 1}</td>
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
                        onClick={() => { handleToggleAvailability(rowIndex, columnIndex);
                      }}
                       className={ dayAvailability[rowIndex] ? "availabilityTimeSlot avaiableTimeSlot" : "availabilityTimeSlot unavaiableTimeSlot" }
                     
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
  const ratingsCounterString = ratingsCounter ? ( ratingsCounter == 1 ? " - 1 rating" : " - "+ ratingsCounter + " ratings"): "";

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