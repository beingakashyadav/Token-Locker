import React from 'react';
import "../styles/App.scss";
import { networks } from "../constants";
import "../styles/Buttons.scss";
import "../styles/Inputs.scss";
import { useAppContext } from './AppContextProvider';
import { shortAddress } from '../helpers';

function NetworkSelector() {
    const ctx = useAppContext();
    let connect = async () => {
        if (typeof window.ethereum === 'undefined' || ctx.userAddress)
            return;

        let request = await window.ethereum.request({ method: 'eth_requestAccounts' });
        await ctx.setAppContext({ userAddress: request[0] });
    };

    let switchNetwork = network => {
        if (networks.find(x => x === network))
            ctx.setAppContext({ network })
    }

    let getConnectBtnLabel = () => {
        let addr = ctx.userAddress;
        if (addr)
            return shortAddress(addr);

        return `Connect to ${ctx.network === "eth" ? "Metamask" : "Terra Station"}`
    }

    return (
        <>
            <div className="tabs">
                <div className="tabs-switcher">
                    <button 
                        className="tabs tabs-eth big-button animated shadow" 
                        onClick={() => switchNetwork("eth")}>
                            eth
                    </button>
                    <button 
                        className="tabs tabs-eth big-button animated shadow" 
                        // onClick={() => switchNetwork("terra")}
                        >terra (soon)</button>
                    <button 
                        className="tabs tabs-connect animated big-button" 
                        onClick={async () => await connect()}>
                            {getConnectBtnLabel()}
                        </button>
                </div>
            </div>
        </>
    );
}

export default NetworkSelector;