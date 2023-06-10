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
    service = service.charAt(0).toUpperCase() + service.slice(1);
    description = description.charAt(0).toUpperCase() + description.slice(1);
    const categoryColor = serviceColoMMap.get(category);
    let durationString = "";
    if (duration < 1) {
        durationString = `${parseInt(duration * 60)} minutes`
    }
    else if (duration === 1) { durationString = "1 hourr" }
    else { durationString = `${parseInt(duration)} hours` }
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
                        <span className="bannerLabel2 d-flex align-items-center">
                            <span className="bannerDescription">duration: </span>
                            <span className="bannerValue">{durationString}</span>
                        </span>
                        <span className="bannerLabel3">
                            <span className="bannerDescription">price: </span>
                            <span className="bannerValue">{priceString}</span>
                        </span>
                    </div>
                    <div>
                        <span className="bannerLabel4 d-flex align-items-center">
                            <button className="bookButton mt-1">book</button>
                        </span>
                    </div>
                 
                </div>
                <div className="expandableWrapper">
                    <div className="expandable ">
                        <div className="expandableContent">
                            <div className="">
                                <span className="expandableDescription me-1">description:</span>
                                <span className="expandableValue">{description}</span>
                            </div>
                            <div className="">
                                <span className="expandableDescription me-1">unit:</span>
                                <span className="expandableValue">{unit}</span>

                                <span className="expandableDescription me-1">personnel:</span>
                                <span className="expandableValue">{personnel}</span>
                                
                                <span className="expandableDescription me-1">included:</span>
                                <span className="expandableValue">{included}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};
