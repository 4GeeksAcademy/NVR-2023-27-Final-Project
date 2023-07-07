import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const SafeguardrModal = (props) => {

    const { store, actions } = useContext(Context);
    const { id, provider_id , service, date} = props;

    const [updatedServiceRequestPasswords, setUpdatedServiceRequestPasswords] = useState({
        verbalPassword: "",
        qrPassword: "",
    })

    const [qrCodeImage, setQrCodeImage] = useState("");

    // useEffects

    useEffect(() => {
        if (store.serviceRequestPasswords) {
            setUpdatedServiceRequestPasswords({
                ...updatedServiceRequestPasswords,
                verbalPassword: store.serviceRequestPasswords.verbal_password,
                qrPassword: store.serviceRequestPasswords.qr_password
            });
        }
    }, [store.serviceRequestPasswords]);


    // useEffect for QR code 

    useEffect(() => {
        const generateQRCode = async (text, size) => {
            
            const adminText = `Solutioner ID:#${id} ${service}, on ${date}. QR password: `
            const encodedText = encodeURIComponent(adminText + text);
            const url = `https://image-charts.com/chart?chs=${size}x${size}&cht=qr&chl=${encodedText}&choe=UTF-8&icqrb=7F7F7F&icqrf=FFFF00`;

            try {
              const response = await fetch(url);
              if (!response.ok) {
                throw new Error('Failed to generate QR code.');
              }
          
              const qrBlob = await response.blob();
              return qrBlob;
            } catch (error) {
              console.error(error);
              return null;
            }
          };
                          
        const generateQR = async () => {
          if (updatedServiceRequestPasswords && updatedServiceRequestPasswords.qrPassword && updatedServiceRequestPasswords.qrPassword !== "") {
            try {
              const qrBlob = await generateQRCode(updatedServiceRequestPasswords.qrPassword,160);
              setQrCodeImage(qrBlob);
            } catch (error) {
              console.error(error);
            }
          }
        };
      
        generateQR();
      }, [updatedServiceRequestPasswords.qrPassword]);
      
      
    // handle Functions

    const handleChangeVerbalPassword = (event) => {
        setUpdatedServiceRequestPasswords({
            ...updatedServiceRequestPasswords,
            verbalPassword: event.target.value
        });
    };

    const handleChangeQrPassword = (event) => {
        setUpdatedServiceRequestPasswords({
            ...updatedServiceRequestPasswords,
            qrPassword: event.target.value
        });
    };

    const handleCloseSafeguardModal = (id) => {
      const dialog = document.querySelector(`#dialogSafeguard${id}`);
      dialog.close();
    }

    // Map

    const experienceMap = new Map([
    [1, "1 year"],
    [2, "1 to 3 years"],
    [3, "over 3 years"],
    ]);

    // Pre-processing props

    const experienceString = (store.providerDetails && store.providerDetails.experience) ? experienceMap.get(store.providerDetails.experience) : "";
    const ratingString = (store.providerDetails && store.providerDetails.average_rating) ? store.providerDetails.average_rating.toFixed(1) : "";
    const ratingsCounterString = (store.providerDetails && store.providerDetails.ratings_counter) ?
    (store.providerDetails.ratings_counter === 1 ? "1 rating" : `${store.providerDetails.ratings_counter} ratings`) :
    "";
  
     
    // subcomponenets

    const roundToNearestHalf = (num) => {
        return Math.floor(num * 2) / 2;
      };
    

    const StarRating = ({ rating }) => {
        const renderStar = (indexOfStar) => {
          if (indexOfStar <= Math.floor(rating)) {
            return (
              <span className="filled-star">
                <svg className="starWhite" xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 -960 960 960" width="10">
                  <path d="m233-80 65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z" />
                </svg>
              </span>
            );
          } else if (indexOfStar === Math.floor(rating) + 1 && rating % 1 !== 0) {
            return (
              <span className="half-filled-star">
                <svg className="starWhite" xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 -960 960 960" width="10">
                  <path d="m480-299 157 95-42-178 138-120-182-16-71-168v387ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z" />
                </svg>
              </span>
            );
          } else {
            return (
              <span className="empty-star">
                <svg className="starWhite" xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 -960 960 960" width="10">
                  <path d="m323-205 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Zm247-355Z" />
                </svg>
              </span>
            );
          }
        };
      
        const stars = [];
        for (let i = 1; i <= 5; i++) {
          stars.push(<span key={i}>{renderStar(i)}</span>);
        }
        return <div className="starRatingWrapper">{stars}</div>;
      };


    // Main JSX
    return (
        <>
          <dialog data-modal id={"dialogSafeguard" + id} className="servieRequestPasswordModal">
            <div className="passwordImagesWrapper d-flex align-items-top ">
              {store.providerDetails ? (
                <div className="providerAvatarImageWrapper p-0 m-0" key={`providerAvatarImage${id}`}>
                  <img className="providerAvatarImage" src={store.providerDetails.avatar_image} alt="Provider Avatar" />
                </div>
              ) : (
                <div className="providerAvatarImageWrapper m-0 p-0" key={`providerAvatarReplacement${id}`}>
                  <div className="providerAvatarReplacement"></div>
                </div>
              )}
              {qrCodeImage ? (
                <div className="qrCodeImageWrapper">
                  <img className="qrCodeImage" src={URL.createObjectURL(qrCodeImage)} alt="QR Code" />
                </div>
              ) : (
                <div className="qrCodeImageWrapper">
                  <div className="replacementQRCode">Enter QR password to generate QR code</div>
                </div>
              )}
            </div>
            <div>
              {store.providerDetails && store.serviceRequestPasswords ? (
                <div>
                  <div>
                    <span className="calendarModalTableLabel me-1">provider:</span>
                    <span className="calendarModalTableValue">{store.providerDetails.name}</span>
                    <span className="calendarModalTableLabel ms-3 me-1">rating:</span>
                    <StarRating rating={roundToNearestHalf(store.providerDetails.average_rating)} />
                    <span className="ms-1 calendarModalTableValue">{ratingString}</span>
                    <span className="calendarModalTableValue ms-1">({ratingsCounterString})</span>
                  </div>
                  <div>
                    <span className="calendarModalTableLabel me-1">experience:</span>
                    <span className="calendarModalTableValue">{experienceString}</span>
                    {store.providerDetails.has_certificate && (
                      <span className="ms-1 certifiedLabel">certified</span>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="d-inline-flex inputFormsWrapper">
              <form role="search" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="serviceSearchField2" className="calendarModalTableLabel">
                  verbal password:
                </label>
                <input
                  id="serviceSearchField2"
                  type="search"
                  maxLength="12"
                  placeholder="Type…"
                  aria-label="Search"
                  value={updatedServiceRequestPasswords.verbalPassword}
                  onChange={handleChangeVerbalPassword}
                />
              </form>
              <form role="search" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="serviceSearchField3" className="calendarModalTableLabel">
                  qr:
                </label>
                <input
                  id="serviceSearchField3"
                  type="search"
                  maxLength="12"
                  placeholder="Type…"
                  aria-label="Search"
                  value={updatedServiceRequestPasswords.qrPassword}
                  onChange={handleChangeQrPassword}
                />
              </form>
            </div>
            <span>
              <button>generate</button>
            </span>
            <span onClick={()=> {handleCloseSafeguardModal(id)}}>
              cancel
            </span>
          </dialog>
        </>
      );
      
};