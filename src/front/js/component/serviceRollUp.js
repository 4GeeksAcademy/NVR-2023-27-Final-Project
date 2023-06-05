import React from "react";

export const ServiceRollUp = (props) => {
    const { id, category, service, description, price, } = props.serviceObject;


    return (
        <>
            <div className="serviceRollUp">
                <div className="serviceRollUpCategoryLabelWrapper">
                    <span className="serviceRollUpCategoryLabel">{category}</span>
                </div>
                <span className="labels">{service}</span>
                <span className="labels">{price}</span>
            </div>

        </>
    );
}