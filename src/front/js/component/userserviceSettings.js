import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const UserServiceSettings = () => {
  const { store, actions } = useContext(Context);

  const [newUserSettings, setNewUserSettings] = useState({});

  const experienceMap = new Map([
    [1, "1 year"],
    [2, "1 to 3 years"],
    [3, "over 3 years"],
  ]);

  useEffect(() => {
    if (store.userSettings) {
      setNewUserSettings({
        must_have_certificate: store.userSettings.must_have_certificate,
        required_experience: store.userSettings.required_experience,
        required_rating: store.userSettings.required_rating
      });
    }
  }, [store.userSettings]);

  // Handle Functions

  const handleToggleCertified = () => {
    setNewUserSettings({ ...newUserSettings, must_have_certificate: !(newUserSettings.must_have_certificate) })
  }

  const handleIncreaseRequiredExperience = () => {
    if (newUserSettings.required_experience === 3) {
      setNewUserSettings({...newUserSettings , required_experience: 1})
    }
    else (setNewUserSettings({...newUserSettings, required_experience: newUserSettings.required_experience +1}))
  }

  // Subcomponents
  
  const StarRatingPicker = () => {
    const requiredRating = newUserSettings.required_rating;
  
    const renderStar = (indexOfStar) => {
      if (indexOfStar <= Math.floor(requiredRating)) {
        return <span className="filled-star">
          <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 -960 960 960" width="12"><path d="m233-80 65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z"/></svg>
        </span>;
      } else if (indexOfStar === Math.floor(requiredRating) + 1 && requiredRating % 1 !== 0) {
        return <span className="half-filled-star">
          <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 -960 960 960" width="12"><path d="m480-299 157 95-42-178 138-120-182-16-71-168v387ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z"/></svg>

        </span>;
      } else {
        return <span className="empty-star">
          <svg xmlns="http://www.w3.org/2000/svg" height="12" viewBox="0 -960 960 960" width="12"><path d="m323-205 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Zm247-355Z"/></svg>
        </span>;
      }
    };
    
  
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i}>{renderStar(i)}</span>
        ))}
      </div>
    );
  };


  // Pre-processing Props

  // Main JSX
  return (
    <>
      <div className="container-fluid vw-100  ms-2">
        <div>
          <span className="settingsTitles">certified-only:</span>
          <span>
            <button className="settingsControl" onClick={handleToggleCertified}>
              {newUserSettings.must_have_certificate ?
                (<svg  xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z" /></svg>)
                :
                (<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Z" /></svg>)
              }
            </button>
          </span>
        </div>
        <div className="mt-1">
            <span className="settingsTitles">
              experience:
            </span>
            <span className="settingsValue ms-2">
              {experienceMap.get(newUserSettings.required_experience)}
            </span>
            <span>
              <button className="settingsControl"
              onClick = {handleIncreaseRequiredExperience}>+</button>
            </span>
        </div>
          <div className="mt-1 d-flex">
            <span className="settingsTitles">rating:</span>
            <span className="ms-2 "><StarRatingPicker /></span>
          </div>
      </div>
    </>
  );
};
