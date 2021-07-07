import React, {  } from 'react';
import { toBaseUnit } from '../helpers';
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
                onChange={(e) => { 
                    ctx.setAppContext({ amount: toBaseUnit(e.target.value.replace(",", "."), 18) }) 
                }}
                placeholder="Amount"
                type="number" />
            {/* <div className="token-user-balance">balance: 1201023</div> */}
        </>
    );
}

const selectToken = (token, ctx) => {
    ctx.setAppContext({ selectedToken: token });
}

export default TokenSelector;