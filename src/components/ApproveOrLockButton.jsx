import moment from 'moment';
import React from 'react';
import { useAppContext } from './AppContextProvider';

const ApproveOrLockButton = ({ }) => {
    const ctx = useAppContext();
    let valid = !!ctx.userAddress && !!ctx.selectedToken && ctx.amount > 0 && ctx.lockUntil > moment().unix();
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
    ctx.contracts
        .alpaca
        .methods
        .approve(ctx.contracts.locker._address, ctx.amount)
        .send({ from: window.web3.currentProvider.selectedAddress })
        .on('receipt', () => {
            ctx.setAppContext({ tokenSpendAllowance: ctx.amount })
        });
}

const lock = (ctx) => {
    ctx.contracts
        .locker
        .methods
        .lock(ctx.lockUntil, ctx.selectedToken.contract, ctx.amount)
        .send({ from: window.web3.currentProvider.selectedAddress })
        .on('receipt', () => {
            ctx.setAppContext({ needUpdateUserLocks: true, needUpdateAllowance: true });
            printStatus(ctx);
        });
}

//for debugging
const printStatus = (ctx) => {
    ctx.contracts
        .alpaca
        .methods
        .balanceOf(ctx.userAddress)
        .call()
        .then(x => { console.log("user balance "); console.log(x) });

    ctx.contracts
        .alpaca
        .methods
        .balanceOf(ctx.contracts.locker._address)
        .call()
        .then(x => { console.log("contract balance "); console.log(x) });
}

export default ApproveOrLockButton;