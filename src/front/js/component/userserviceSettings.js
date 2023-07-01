import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const UserServiceSettings = () => {
  const { store, actions } = useContext(Context);

  const [newUserSettings, setNewUserSettings] = useState({});

  const experienceMap = new Map([
    [1, "1 year"],
    [2, "1-3 years"],
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
            <span className="settingsValue ms-1">
              {experienceMap.get(newUserSettings.required_experience)}
            </span>
            <span>
              <button className="settingsControl"
              onClick = {handleIncreaseRequiredExperience}>+</button>
            </span>
        </div>
        <div>{newUserSettings.required_rating}</div>
      </div>
    </>
  );
};
