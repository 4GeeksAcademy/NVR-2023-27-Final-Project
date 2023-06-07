import React from "react";

export const ServiceRollUp = (props) => {
    const { id, category, service, description, unit, duration, personnel, included, price } = props.serviceObject;

    const generateRGBColor = (inputString) => {
        const substring = inputString.substring(0, 3);
        const charCodes = substring.split('').map((char) => char.charCodeAt(0));
        const hue = charCodes[0] % 360;
        const saturation = 70 + (charCodes[1] % 31);
        const lightness = 50 + (charCodes[2] % 31);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      };

    return (
        <>
            <div className="serviceRollUp my-1">
                <div className="serviceRollUpBanner">
                    <div className="rollUpCategoryLabelWrapper">
                        <span className="rollUpCategoryLabel">{category}</span>
                    </div>
                    <div className="">
                        <span className="rollUpServiceLabel">{service}</span>
                        <span className="">{duration}</span>                       
                        <span className="rollUpPriceDescription">price: </span>
                        <span className="rollUpPriceLabel">{price}€</span>
                    </div>
                </div>
                <div className="expandableWrapper">
                    <div>
                        <div className="expandable ">
                            <div className="expandableContent">
                                <div>
                                    <div className="">"
                                        <div>Description:</div>
                                        <div className="rollUpDescriptionLabel">{description}</div>
                                    </div>
                                    <div className="cardLabels">
                                        <div>provision:</div>
                                        <div>included::</div>
                                        <div>personnel:</div>
                                    </div>
                                    <div className="cardInfo">
                                        <div>{unit}</div>
                                        <div>{included}</div>
                                        <div>{personnel}</div>
                                    </div>
                                </div>
                                <div className="scheduleButtonWrapper">
                                    <button className="scheduleButton">Schedule</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>


    );
};

{/* <div className="serviceRollUp">

<div className="serviceRollUpCategoryLabelWrapper">
    <span className="serviceRollUpCategoryLabel">{category}</span>
</div>
<span className="serviceRollUpServiceLabel">{service}</span>
<span className="serviceRollUpPriceLabel">Price: {price}€</span>
<span className="">
    <button
        className="reviewServiceButton ms-auto"
        type="button"
    >
        review and schedule
    </button>
</span>

</div> */}