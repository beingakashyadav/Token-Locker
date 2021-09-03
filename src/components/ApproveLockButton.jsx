import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fromBaseUnit } from '../helpers';
import { approveToken, getSelectedTokenApproval, lockToken } from '../reduxSlices/tokenSelectorSlice';
import LoadingSpinner from './LoadingSpinner';

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

    let balance = fromBaseUnit(tokenSelectorSlice.balance);
    let valid = Number(tokenSelectorSlice.amount) > 0 &&
        Number(tokenSelectorSlice.amount) <= Number(balance) &&
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

    let balance = fromBaseUnit(tokenSelectorSlice.balance);
    let valid = tokenSelectorSlice.selectedToken.address &&
        Number(tokenSelectorSlice.amount) > 0 &&
        Number(tokenSelectorSlice.amount) <= Number(balance) &&
        tokenSelectorSlice.lockUntil > moment().unix()

    let approved = Number(fromBaseUnit(tokenSelectorSlice.approvedAmount)) >= Number(tokenSelectorSlice.amount);
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