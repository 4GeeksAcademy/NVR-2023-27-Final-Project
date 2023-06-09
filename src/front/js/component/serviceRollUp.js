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

    category = category.charAt(0).toLowerCase() + category.slice(1);
    const categoryColor = serviceColoMMap.get(category);
    let durationString = "";
    if (duration < 1) {
        durationString = `${parseInt(duration * 60)} mins`
    }
    else if (duration === 1) { durationString = "1 hr" }
    else { durationString = `${parseInt(duration)} hrs` }

    const priceString = price + ".00€"
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
                            <span className="bannerIcon">
                                <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-384 288-576h384L480-384Z" /></svg>
                            </span>
                        </span>
                    </div>
                </div>
                <div className="expandableWrapper">
                    <div>
                        <div className="expandable ">
                            <div className="expandableContent">
                                <table className="expandableTbale">
                                    <tbody>
                                        <tr className="expandableTableRow">
                                            <td className="expandableDescription right-align">unit:</td>
                                            <td className="expandableValue left-align">{unit}</td>
                                        </tr>
                                        <tr className="expandableTableRow">
                                            <td className="expandableDescription right-align">included:</td>
                                            <td className="expandableValue left-align">{included}</td>
                                        </tr>
                                        <tr className="expandableTableRow">
                                            <td className="expandableDescription right-align">personnel:</td>
                                            <td className="expandableValue left-align">{personnel}</td>
                                        </tr>
                                        <tr className="expandableTableRow">
                                            <td className="expandableDescription right-align">description:</td>
                                            <td className="expandableValue left-align">{description}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};
