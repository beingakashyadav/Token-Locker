import React, {  } from 'react';
import "../styles/App.scss";
import "../styles/Buttons.scss";
import "../styles/Inputs.scss";
import { useAppContext } from './AppContextProvider';
import SelectToken from './SelectTokenModal';

const TokenSelector = () => {
    const ctx = useAppContext();

    let selectToken = (token) => {
        if (!ctx.userAddress)
            return;
        console.log(token);
        ctx.setAppContext({ selectedToken: token });
    }

    return (
        <>
            <SelectToken
                selectTokenCallback={(token) => selectToken(token)}
                tokenList={ctx.coinsToSelect}
                renderButton={(open) => (
                    <button className="big-button" onClick={open}>
                        <span>{ctx.selectedToken.ticker} ▼</span>
                    </button>
                )} />
            <input className="big-input"
                onChange={(e) => { ctx.setAppContext({ amount: Number.parseInt(e.target.value) }) }}
                placeholder="Amount" />
        </>
    );
}

export default TokenSelector;