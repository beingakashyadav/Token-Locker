import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../context.js';

const defaultState = {
    externalDataLoaded: false,
    coinsToSelect: [],
    userLocks: {},
    contracts: {},
    lockerContract: {},
    userAddress: "",
    chain: "eth",
    tokenSpendAllowance: -1,
    amount: -1,
    lockUntilDate: -1,
    needUpdateUserLocks: true, 
    needUpdateAllowance: true
};

const AppContextProvider = props => {

    const [state, setState] = useState({ ...defaultState });

    //for debugging
    window.ctx = state;
    useEffect(() => {
        console.log(state);
    }, [state])


    const setAppContext = (appContext) => {
        setState({ ...state, ...appContext });
    };

    return (
        <AppContext.Provider value={{ ...state, setAppContext }}>
            {props.children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;