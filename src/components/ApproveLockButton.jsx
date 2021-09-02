import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toBaseUnit, toBigNumber } from '../helpers';
import { approveToken, getSelectedTokenApproval, lockToken } from '../reduxSlices/tokenSelectorSlice';
import LoadingSpinner from './LoadingSpinner';
import Web3Utils from "web3-utils";

const ApproveLockButton = () => {
    const dispatch = useDispatch();
    const tokenSelectorSlice = useSelector(state => state.tokenSelectorSlice);
    const externalDataSlice = useSelector(state => state.externalDataSlice);
    const networkSlice = useSelector(state => state.networkSlice);

    useEffect(() => {
        if (!networkSlice.userAddress ||
            !tokenSelectorSlice.selectedToken.address)
            return;

        dispatch(getSelectedTokenApproval({
            spenderAddress: externalDataSlice.locker.address,
            userAddress: networkSlice.userAddress,
            selectedTokenAddress: tokenSelectorSlice.selectedToken.address
        }));
    }, [networkSlice.userAddress, tokenSelectorSlice.selectedToken.address, externalDataSlice.locker.address, dispatch])

    if (!networkSlice.userAddress)
        return null;


    if (tokenSelectorSlice.isApproveLockLoading)
        return (<LoadingSpinner />)
    
    return tokenSelectorSlice.selectedToken.native ? <ApproveLockBtnForEth /> : <ApproveLockBtnForErc20 />
};

const ApproveLockBtnForEth = () => {
    const dispatch = useDispatch();
    const tokenSelectorSlice = useSelector(state => state.tokenSelectorSlice);

    let valid = Number(tokenSelectorSlice.amount) > 0 &&
        toBaseUnit(tokenSelectorSlice.amount).cmp(toBigNumber(tokenSelectorSlice.balance)) <= 0 &&
        tokenSelectorSlice.lockUntil > moment().unix();

    let btnclass = `lock-button animated big-button ${!valid && "disabled"}`;
    let lockBtn = (<button
        className={btnclass}
        onClick={async () => { 
            await dispatch(lockToken({}));
        }}>
            Lock
        </button>);

    return lockBtn;
}

const ApproveLockBtnForErc20 = () => {
    const dispatch = useDispatch();
    const tokenSelectorSlice = useSelector(state => state.tokenSelectorSlice);

    let zero = toBigNumber(0)
    let baseAmount = toBaseUnit(tokenSelectorSlice.amount);
    let valid = tokenSelectorSlice.selectedToken.address &&
        baseAmount.cmp(zero) > 0 &&
        baseAmount.cmp(toBigNumber(tokenSelectorSlice.balance)) <= 0 &&
        tokenSelectorSlice.lockUntil > moment().unix()

    let approved = toBigNumber(tokenSelectorSlice.approvedAmount).cmp(toBaseUnit(tokenSelectorSlice.amount)) > 0;
    let btnclass = `lock-button animated big-button ${!valid && "disabled"}`;

    let lockBtn = (<button
        className={btnclass}
        onClick={async () => { 
            await dispatch(lockToken({}));
        }}>
            Lock
        </button>);

    let approveBtn = (<button
        className={btnclass}
        onClick={async () => {
            await dispatch(approveToken({}));
        }}>
            Approve
        </button>);

    return approved ? lockBtn : approveBtn;
}

export default ApproveLockButton;