import React from 'react';
import "../styles/App.scss";
import "../styles/Buttons.scss";
import "../styles/Inputs.scss";
import { shortAddress } from '../helpers';
import { useSelector, useDispatch } from 'react-redux';
import { connectToProvider, selectNetwork, setAddress } from '../reduxSlices/networkSlice';

function NetworkSelector() {
    const networkState = useSelector(state => state.networkSlice);
    const dispatch = useDispatch();

    return (
        <>
            <div className="tabs">
                <div className="tabs-switcher">
                    <button
                        className="tabs tabs-eth big-button animated shadow"
                        onClick={() => dispatch(selectNetwork({ network: "eth" }))}>
                        eth
                    </button>
                    {/* <button
                        className="tabs tabs-eth big-button animated shadow"
                        onClick={() => dispatch(selectNetwork({ network: "terra" }))}>
                        Terra</button> */}
                    <button
                        className="tabs tabs-connect animated big-button"
                        onClick={async () => await onConnectButtonClick(networkState, dispatch)}>
                        {getConnectButtonLabel(networkState)}
                    </button>
                </div>
            </div>
        </>
    );
}

const onConnectButtonClick = async (networkState, dispatch) => {
    if (networkState.userAddress)
        await dispatch(setAddress(""));
    else 
        await dispatch(connectToProvider());
}

const getConnectButtonLabel = (networkState) => {
    if (networkState.userAddress)
        return shortAddress(networkState.userAddress);

    return `Connect to ${networkState.network === "terra" ? "Terra Station" : "Metamask"}`;
}

export default NetworkSelector;