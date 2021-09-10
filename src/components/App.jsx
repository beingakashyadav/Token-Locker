import React, { useEffect } from 'react';
import "../styles/App.scss";
import "../styles/Buttons.scss";
import "../styles/Inputs.scss";
import NetworkSelector from './NetworkSelector';
import ApproveLockButton from './ApproveLockButton';
import TokenSelector from './TokenSelector';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import UserLocks from "./UserLocks"
import { useDispatch, useSelector } from 'react-redux';
import { fetchExternalData, setNetwork } from '../reduxSlices/externalDataSlice';
import { setLockUntil } from '../reduxSlices/tokenSelectorSlice';
import { ETH_GANACHE, ETH_ROPSTEN } from '../constants';
import { setAddress } from '../reduxSlices/networkSlice';
import Web3Utils from 'web3-utils';

const App = () => {
    const dataState = useSelector(state => state.externalDataSlice);
    const tokenSelectorSlice = useSelector(state => state.tokenSelectorSlice);
    const networkSlice = useSelector(state => state.networkSlice);
    const dispatch = useDispatch();

    useEffect(() => {
        if (dataState.externalDataLoaded || !window?.ethereum?.isMetaMask)
            return;

        window.ethereum.on('accountsChanged', (accounts) => {
            dispatch(setAddress({ userAddress: accounts[0] }));
        });

        window.ethereum.on('chainChanged', (chainId) => {
            dispatch(setNetwork(Web3Utils.hexToNumber(chainId)));
        });

        dispatch(fetchExternalData());
    }, [dispatch, dataState.externalDataLoaded])

    if (!window?.ethereum?.isMetaMask)
        return ("No metamask detected");

    if (dataState.chainId !== ETH_ROPSTEN && dataState.chainId !== ETH_GANACHE)
        return ("Please switch network to Ropsten");

    if (!dataState.externalDataLoaded)
        return ("Loading...");

    let dateInvalid = tokenSelectorSlice.lockUntil < moment().unix() &&
        networkSlice.userAddress &&
        Number(tokenSelectorSlice.amount) > 0;

    return (
        <>
            <NetworkSelector />
            <div className="lock">
                <div className="lock-blocks">
                    <span className="lock-label first-label">Select token to lock</span>
                    <div className="lock-block swap-addresses-from">
                        <TokenSelector />
                    </div>
                    <span className="lock-label">Select date to lock until</span>
                    <div className="lock-block">
                        <Datetime
                            isValidDate={current => (current.isAfter(moment().subtract(1, "day")))}
                            onChange={(e) => e instanceof moment && dispatch(setLockUntil(e.unix()))}
                            className={dateInvalid ? "red-rdt" : ""} />
                    </div>
                    <ApproveLockButton />
                    <UserLocks />
                </div>
            </div>
        </>
    );
}

export default App;