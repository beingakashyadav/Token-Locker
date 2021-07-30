import React, { useEffect } from 'react';
import { toBaseUnit } from '../helpers';
import "../styles/App.scss";
import "../styles/Buttons.scss";
import "../styles/Inputs.scss";
import { useAppContext } from './AppContextProvider';
import SelectToken from './SelectTokenModal';

const TokenSelector = () => {
    const ctx = useAppContext();

    //update balance of selected token
    useEffect(() => {
        if (!ctx.selectedToken.address || !ctx.userAddress)
            return;

        ctx.selectedToken
            .contract
            .methods
            .balanceOf(ctx.userAddress)
            .call()
            .then(x => {
                let newToken = Object.assign({}, ctx.selectedToken);
                newToken.balance = x;
                ctx.setAppContext({ selectedToken: newToken })
            });
    }, [ctx.selectedToken.balance, ctx.userAddress])

    let balanceLabel = ctx.selectedToken?.balance && ctx.userAddress ? (
        <div className="token-user-balance">balance: {ctx.selectedToken?.balance}</div>
    ) : null;

    return (
        <>
            <SelectToken
                tokenList={ctx.coinsToSelect || []}
                renderButton={(open) => (
                    <button className="big-button" onClick={open}>
                        <span>{ctx.selectedToken.ticker} ▼</span>
                    </button>
                )} />
            <input className="big-input"
                onChange={(e) => {
                    ctx.setAppContext({ amount: toBaseUnit(e.target.value.replace(",", "."), 18) })
                }}
                placeholder="Amount"
                type="number" />
            {balanceLabel}
        </>
    );
}

export default TokenSelector;