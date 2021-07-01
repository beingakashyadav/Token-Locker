import React, {  } from 'react';
import "../styles/App.scss";
import "../styles/Buttons.scss";
import "../styles/Inputs.scss";
import { useAppContext } from './AppContextProvider';
import SelectToken from './SelectTokenModal';

const TokenSelector = () => {
    const ctx = useAppContext();
    const selectedToken = ctx.selectedToken || {};

    return (
        <>
            <SelectToken
                selectTokenCallback={(token) => selectToken(token, ctx)}
                tokenList={ctx.coinsToSelect || []}
                renderButton={(open) => (
                    <button className="big-button" onClick={open}>
                        <span>{selectedToken.ticker} ▼</span>
                    </button>
                )} />
            <input className="big-input"
                onChange={(e) => { ctx.setAppContext({ amount: Number.parseFloat(e.target.value.replace(",", ".")) }) }}
                placeholder="Amount"
                type="number" />
        </>
    );
}

const selectToken = (token, ctx) => {
    ctx.setAppContext({ selectedToken: token });
}

export default TokenSelector;