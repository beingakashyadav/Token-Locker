import React, { useContext, useReducer, useState } from 'react';
import AppContext from '../context.js';

const AppContextProvider = props => {
    const [state, setState] = useState({
        address: ""
    });

    const setAppContext = (appContext) => {
        console.log(state);
        setState({ ...state, ...appContext });
    };

    return (
        <AppContext.Provider value={{ ...state, setAppContext }}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;