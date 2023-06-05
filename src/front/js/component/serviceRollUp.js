import React from "react";

export const ServiceRollUp = (props) => {
    const { id, category, service, description, price } = props.serviceObject;



    return (

        <>
            <div className="Outer my-1">
                <div className="banner py-0 my-0 gy-0">
                    123456789
                </div>
                <div className="quick-example">
                    <div>
                        <div className="expandable ">
                            <div className="expandableContent">
                                <div>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi corrupti,
                                sint distinctio deserunt vel unde consequatur sequi nobis necessitatibus
                                quis ad officiis doloremque ab, blanditiis facere possimus obcaecati
                                voluptate sed!
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