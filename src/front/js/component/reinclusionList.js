import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const ReInclusionList = () => {
    const { store, actions } = useContext(Context);

    const [excludedProviderName, setExcludedProviderName] = useState(null);
    const [existingUserExclusions, setExistingUSerExclusions] = useState([]);
    let excludedProviderId = null;

    useEffect(() => {
        if (store.userExclusions) {
            let auxiliaryArray = [];
            for (let i = 1; i <= 5; i++) {
                const nameKey = `exclusion${i}_name`;
                const idKey = `exclusion${i}_id`;

                if (store.userExclusions[nameKey] !== "") {
                    auxiliaryArray.push({
                        name: store.userExclusions[nameKey],
                        id: store.userExclusions[idKey]
                    });
                }
            }
            auxiliaryArray.sort((firstExclusion, secondExclusion) => firstExclusion.name.localeCompare(secondExclusion.name));
            setExistingUSerExclusions(auxiliaryArray)
            setExcludedProviderName(auxiliaryArray[0].name)
            excludedProviderId = auxiliaryArray[0].id

        }

    }, [store.userExclusions]);

    // Handle Functions
    const handleSelectProvider = (providerName, providerId) => {
        setExcludedProviderName(providerName);
        excludedProviderId = providerId;
    }

    // Main JSX
    return (
        <>
            <div className="container-fluid">
                <div>
                    <span className="settingsTitles ms-1">reinstate:</span>
                    <span className="settingsValue ms-1">{excludedProviderName}</span>
                    <span>
                        <button className="settingsControl3">+</button>
                    </span>
                    <span>
                        <button className="settingsControl4">-</button>
                    </span>
                </div>
                                        
                <div className="">
                    <button className="updateButton">reinstate</button>
                </div>
            </div>
        </>
    );

};
