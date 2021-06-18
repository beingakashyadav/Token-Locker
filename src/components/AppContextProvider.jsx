import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../context.js';

const AppContextProvider = props => {

    const [state, setState] = useState({
        externalDataLoaded: false,
        coinsToSelect: [],
        userLocks: {},
        contracts: {},
        userAddress: "",
        network: "eth",
        selectedToken: {},
        tokenSpendAllowance: -1,
        amount: -1,
        lockUntil: -1,
        needUpdateUserLocks: true, needUpdateAllowance: true
    });

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