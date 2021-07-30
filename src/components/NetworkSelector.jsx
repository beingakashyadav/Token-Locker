import React, { useEffect } from 'react';
import "../styles/App.scss";
import { chains } from "../constants";
import "../styles/Buttons.scss";
import "../styles/Inputs.scss";
import { useAppContext } from './AppContextProvider';
import { shortAddress } from '../helpers';

function NetworkSelector() {
    const ctx = useAppContext();

    return (
        <>
            <div className="tabs">
                <div className="tabs-switcher">
                    <button
                        className="tabs tabs-eth big-button animated shadow"
                        onClick={() => switchNetwork(ctx, "eth")}>
                        eth / bsc
                    </button>
                    <button
                        className="tabs tabs-eth big-button animated shadow"
                        onClick={() => switchNetwork(ctx, "terra")}
                    >terra</button>
                    <button
                        className="tabs tabs-connect animated big-button"
                        onClick={async () => ctx.userAddress ? disconnect(ctx) : await connect(ctx)}>
                        {getConnectBtnLabel(ctx)}
                    </button>
                </div>
            </div>
        </>
    );
}

const connect = async (ctx) => {
    if (typeof window.ethereum === 'undefined' || ctx.userAddress)
        return;

    let request = await window.ethereum.request({ method: 'eth_requestAccounts' });
    ctx.setAppContext({ userAddress: request[0] });
};

const disconnect = (ctx) => {
    ctx.setAppContext({ userAddress: "" });
};

const switchNetwork = (ctx, network) => {
    let chain = chains.find(x => x.name === network);

    if (chain)
        ctx.setAppContext({ chain });
}

const getConnectBtnLabel = (ctx) => {
    let addr = ctx.userAddress;
    if (addr)
        return shortAddress(addr);

    return `Connect to ${ctx.chain.name === "eth" ? "Metamask" : "Terra Station"}`
}

export default NetworkSelector;