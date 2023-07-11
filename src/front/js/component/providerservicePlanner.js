import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const ProviderServicePlanner = () => {
    const { store, actions } = useContext(Context);

    return(
        <>
            <div>
            Service Planner Connected
            </div>        
        </>
    )
}