import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const RateBanrModal = (props) => {
  // prop destructuring
  const { store, actions } = useContext(Context);
  const { id, provider_id, service, date } = props;

  // handle functions
  const handleCloseRateBanModal = (id) => {
    const dialog = document.querySelector(`#dialogRateBan${id}`);
    dialog.close();
  };

  const handleRateProvider = () => {};

  // Main JSX
  return (
    <>
      <dialog data-modal id={"dialogRateBan" + id} className="largeDialogElement">
        <div className="row">
          <div className="col-md-6">
            {store.providerDetails ? (
              <div className="providerAvatarImageWrapper p-0 m-0" key={`providerAvatarImage${id}`}>
                <img className="providerAvatarImage" src={store.providerDetails.avatar_image} alt="Provider Avatar" />
              </div>
            ) : (
              <div className="providerAvatarImageWrapper m-0 p-0" key={`providerAvatarReplacement${id}`}>
                <div className="providerAvatarReplacement"></div>
              </div>
            )}
          </div>
          <div className="gx-4 col-md-6">
            <div>
              <div>
                <span className="calendarModalTableLabel me-1">service:</span>
                <span className="calendarModalTableValue">{service}</span>
              </div>
              <div>
                <span className="calendarModalTableLabel me-1">date:</span>
                <span className="calendarModalTableValue">{date}</span>
              </div>
              <div>
                <span className="calendarModalTableLabel me-1">provider:</span>
                <span className="calendarModalTableValue">{store.providerDetails && store.providerDetails.name}</span>
              </div>
              <div>
                rating picker
              </div>
              <div>
                <span><button>exclude</button></span>
                <span><button>rate</button></span>
              </div>
            </div>
            <div>
                <button className="cancelButton" onClick={() => handleCloseRateBanModal(id)}>cancel</button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};
