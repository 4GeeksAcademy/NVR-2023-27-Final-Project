import React from "react";

export const ServiceRollUp = (props) => {
    let { id, category, service, description, unit, duration, personnel, included, price } = props.serviceObject;

    const serviceColoMMap = new Map([
        ["cleaning", "#32CD32"],
        ["wardrobe", "red"],
        ["plumbing", "#AFEEEE"],
        ["electrical", "yellow"],
        ["hvac", "purple"],
        ["security", "#9400D3"],
        ["handyman", "#EE4B2B"],
        ["patching", "yellow"],
        ["gardening", "green"],
        ["extermination", "teal"],
        ["eventing", "purple"],
        ["companionship", "#FF69B5"],
        ["grooming", "navy"],
        ["nursing", "green"],
        ["nannying", "cyan"],
        ["petcare", "brown"],
        ["wellness", "pink"],
    ]);

    // Format props
    category = category.charAt(0).toLowerCase() + category.slice(1);
    const categoryColor = serviceColoMMap.get(category);
    let durationString = "";
    if (duration < 1) {
        durationString = `${parseInt(duration * 60)} mins`
    }
    else if (duration === 1) { durationString = "1 hr" }
    else { durationString = `${parseInt(duration)} hrs` }
    const priceString = price + ".00€"
    
    // Main JSX
    return (
        <>
            <div className="serviceRollUp my-1">
                <div className="serviceRollUpBanner ps-3">
                    <div className="bannerCategoryColorWrapper" style={{ backgroundColor: categoryColor }}>
                        <span className="bannerCategoryColor" style={{ backgroundColor: categoryColor }}>&nbsp;</span>
                    </div>
                    <div className="bannerCategoryLabelWrapper">
                        <span className="bannerCategoryLabel">{category}</span>
                    </div>
                    <div className="bannerLabels">
                        <span className="bannerLabel1">
                            <span className="bannerDescription">service:</span>
                            <span className="bannerValue">{service}</span>
                        </span>
                        <span className="bannerLabel2">
                            <span className="bannerDescription">duration: </span>
                            <span className="bannerValue">{durationString}</span>
                        </span>
                        <span className="bannerLabel3">
                            <span className="bannerDescription">price: </span>
                            <span className="bannerValue">{priceString}</span>
                        </span>
                        <span className="bannerLabel4">
                            <button className="bookButton">Book</button>
                        </span>
                    </div>
                </div>
                <div className="expandableWrapper">
                    <div>
                        <div className="expandable ">

                            <div className="expandableContent">
                                            <div>
                                                <span className="expandableDescription right-align">description:</span>
                                                <span className="expandableValue left-align">{description}</span>
                                            </div>
                                            <div>
                                                <span className="expandableDescription right-align">unit:</span>
                                                <span className="expandableValue left-align me-3">{unit}</span>
                                                <span className="expandableDescription right-align">personnel:</span>
                                                <span className="expandableValue left-align me-3">{personnel}</span>
                                                <span className="expandableDescription right-align">included:</span>
                                                <span className="expandableValue left-align">{included}</span>
                                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};
