import React, { useContext, useEffect, useState } from 'react';
import { chains } from '../constants.js';
import AppContext from '../context.js';
import { toBigNumber } from '../helpers.js';

const defaultState = {
    externalDataLoaded: false,
    coinsToSelect: [],
    userLocks: {},
    selectedToken: {},
    contracts: {},
    lockerContract: {},
    userAddress: "",
    chain: chains[0],
    tokenSpendAllowance: toBigNumber(-1),
    amount: toBigNumber(-1),
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