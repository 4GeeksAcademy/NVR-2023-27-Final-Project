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

  const [exclusionsIndex, setExclusionsIndex] = useState(0)
  const [exclusionObject, setExclusionObject] = useState({});

  // useEffects

  useEffect(() => {
    if (store.userSettings) {
      setNewUserSettings({
        must_have_certificate: store.userSettings.must_have_certificate,
        required_experience: store.userSettings.required_experience,
        required_rating: store.userSettings.required_rating
      });
    }
  }, [store.userSettings]);


  useEffect(() => {
    if (store.userExclusions) {
      setExclusionObject(store.userExclusions[exclusionsIndex])
    }

  }, [store.userExclusions, exclusionsIndex]);



  // Handle Functions

  const handleToggleCertified = () => {
    setNewUserSettings({ ...newUserSettings, must_have_certificate: !(newUserSettings.must_have_certificate) })
  }

  const handleIncreaseRequiredExperience = () => {
    if (newUserSettings.required_experience === 3) {
      setNewUserSettings({ ...newUserSettings, required_experience: 1 })
    }
    else (setNewUserSettings({ ...newUserSettings, required_experience: newUserSettings.required_experience + 1 }))
  }

  const handleIncreaseRating = () => {
    if (newUserSettings.required_rating === 5) {
      setNewUserSettings({ ...newUserSettings, required_rating: 1 });
    } else {
      setNewUserSettings({ ...newUserSettings, required_rating: newUserSettings.required_rating + 0.5 });
    }
  };

  const handleDecreaseRating = () => {

    if (newUserSettings.required_rating === 1) {
      setNewUserSettings({ ...newUserSettings, required_rating: 5 });
    } else {
      setNewUserSettings({ ...newUserSettings, required_rating: newUserSettings.required_rating - 0.5 });
    }
  };

  const handleUpdateUserSettings = () => {
    actions.updateUserSettings(newUserSettings);
  }

  // handle Thumbnail gallery

  const handleNextExclusion = () => {
    if (exclusionsIndex === store.userExclusions.length - 1) {
      setExclusionsIndex(0)
    }
    else (
      setExclusionsIndex((value) => value + 1)
    );
  };

  const handlePreviousExclusion = () => {
    if (exclusionsIndex === 0) {
      setExclusionsIndex(store.userExclusions.length - 1)
    }
    else (
      setExclusionsIndex((value) => value - 1)
    );

  };

  const handleReinstate = (exclusionId) => {
    actions.deleteExclusion(exclusionId)
  }


  // Subcomponents

  const StarRatingPicker = () => {
    const requiredRating = newUserSettings.required_rating;

    const renderStar = (indexOfStar) => {
      if (indexOfStar <= Math.floor(requiredRating)) {
        return <span className="filled-star">
          <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="m233-80 65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z" /></svg>
        </span>;
      } else if (indexOfStar === Math.floor(requiredRating) + 1 && requiredRating % 1 !== 0) {
        return <span className="half-filled-star">
          <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="m480-299 157 95-42-178 138-120-182-16-71-168v387ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z" /></svg>

        </span>;
      } else {
        return <span className="empty-star">
          <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="m323-205 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Zm247-355Z" /></svg>
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
      <div className="container-fluid mb-5 ms-3">
        <div className="mt-2">
          <span className="settingsTitles">certified-only:</span>
          <span>
            <button className="settingsControl1 clickable" onClick={handleToggleCertified}>
              {newUserSettings.must_have_certificate ?
                (<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="m419-321 289-289-43-43-246 246-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z" /></svg>)
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
            <button className="settingsControl2 clickable"
              onClick={handleIncreaseRequiredExperience}>+</button>
          </span>
        </div>
        <div className="mt-1 d-flex">
          <span className="settingsTitles settingsRatingLabel">rating:</span>
          <span className="ms-1 "><StarRatingPicker /></span>
          <span>
            <button className="settingsControl3 clickable" onClick={handleIncreaseRating}>+</button>
          </span>
          <span>
            <button className="settingsControl4 clickable" onClick={handleDecreaseRating}>-</button>
          </span>

        </div>
        <div className="mt-3">
          <button
            onClick={handleUpdateUserSettings}
            className="updateettingsButton">update</button>
        </div>
        <div className="mt-5">
          <>
            {(store.userExclusions && store.userExclusions.length) ? (
              <div id="carouselExample" className="carousel slide" data-bs-interval="false">
                <div className="carousel-inner carouselWrapper">
                  {store.userExclusions.map((exclusion, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${index === 0 ? 'active' : ''}`}
                    >
                      <span className="providerThumbnailWrapper">
                        <img
                          src={exclusion.image}
                          alt={exclusion.name}
                          className="providerThumbnail"
                        />
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev clickable overideBootstarp settingsControl6"
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="next"
                  onClick={handleNextExclusion}
                >
                  +
                </button>
                <button
                  className="carousel-control-next settingsControl7 clickable overideBootstarp"
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="prev"
                  onClick={handlePreviousExclusion}
                >
                  -
                </button>
                {(store.userExclusions[exclusionsIndex] && store.userExclusions[exclusionsIndex].name) && (
                  <>
                    <span className="settingsValue mt-3">
                      {
                        store.userExclusions[exclusionsIndex].name 
                        .split(' ')[0]
                        .concat(' ', store.userExclusions[exclusionsIndex].name.split(' ')[1][0].toUpperCase())
                        .concat('.')                        
                      }
                    </span>
                  </>
                )}
              </div>
            ) : null}
          </>
        </div>
        {store.userExclusions && store.userExclusions.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => handleReinstate(store.userExclusions[exclusionsIndex].id)}
              className="updateettingsButton">
              reinstate</button>
          </div>
        )}
      </div>
    </>
  );
};
