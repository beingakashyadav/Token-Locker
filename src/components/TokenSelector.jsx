import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fromBaseUnit } from '../helpers';
import { getSelectedTokenBalance, selectToken, setTokenAmount } from '../reduxSlices/tokenSelectorSlice';
import "../styles/App.scss";
import "../styles/Buttons.scss";
import "../styles/Inputs.scss";
import SelectTokenModal from './SelectTokenModal';

const TokenSelector = () => {
    const selectorState = useSelector(state => state.tokenSelectorSlice);
    const networkState = useSelector(state => state.networkSlice);
    const dispatch = useDispatch();

    const tokenList = useSelector(state => state.externalDataSlice.tokenList);

    useEffect(() => {
        if (selectorState.selectedToken.ticker)
            return;

        dispatch(selectToken(tokenList[0]))
    }, [dispatch, selectorState.selectedToken.ticker, tokenList]);

    useEffect(() => {
        if (!networkState.userAddress)
            return;

        dispatch(getSelectedTokenBalance({
            tokenAddress: selectorState.selectedToken.address,
            userAddress: networkState.userAddress,
            isNativeCurrency: selectorState.selectedToken.native
        }));
    }, [dispatch, networkState.userAddress, selectorState.selectedToken.address])

    let balanceLabel = selectorState.balance && networkState.userAddress ? (
        <div className="token-user-balance">balance: {fromBaseUnit(selectorState.balance)}</div>
    ) : null;

    return (
        <>
            <SelectTokenModal />
            <input className="big-input"
                onChange={(e) => {
                    let amount = e.target.value.replace(",", ".");
                    dispatch(setTokenAmount(amount));
                }}
                placeholder="Amount"
                type="number" />
            {balanceLabel}
        </>
    );
}

export default TokenSelector;