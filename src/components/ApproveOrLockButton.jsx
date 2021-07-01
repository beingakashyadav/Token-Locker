import moment from 'moment';
import React from 'react';
import { toBaseUnit } from '../helpers';
import { useAppContext } from './AppContextProvider';

const ApproveOrLockButton = () => {
 
    const ctx = useAppContext();
    let valid = !!ctx.userAddress && !!ctx.selectedToken && ctx.amount > 0 && ctx.lockUntilDate > moment().unix();
    let approved = ctx.tokenSpendAllowance > 0 && ctx.tokenSpendAllowance >= ctx.amount;
    let btnclass = `lock-button animated big-button ${!valid && "disabled"}`;

    let lockBtn = (<button
        className={btnclass}
        onClick={valid ? () => lock(ctx) : () => { }}>Lock</button>); //empty object for future scenarios

    let approveBtn = (<button
        className={btnclass}
        onClick={valid ? () => approve(ctx) : () => { }}>Approve</button>);

    return approved ? lockBtn : approveBtn;
};

const approve = (ctx) => {
    ctx.selectedToken
        .contract
        .methods
        .approve(ctx.lockerContract._address, toBaseUnit(ctx.amount.toString(), 18))
        .send({ from: window.web3.currentProvider.selectedAddress })
        .on('receipt', () => {
            ctx.setAppContext({ tokenSpendAllowance: ctx.amount })
        });
}

const lock = (ctx) => {
    ctx.lockerContract
        .methods
        .lock(ctx.lockUntilDate, ctx.selectedToken.address, toBaseUnit(ctx.amount.toString(), 18)) //need to get token decimals from somewhere
        .send({ from: window.web3.currentProvider.selectedAddress })
        .on('receipt', () => {
            ctx.setAppContext({ needUpdateUserLocks: true, needUpdateAllowance: true });
        });
}

export default ApproveOrLockButton;