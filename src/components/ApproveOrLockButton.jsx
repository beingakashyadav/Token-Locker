import moment from 'moment';
import React, { useEffect } from 'react';
import { contextType } from 'react-datetime';
import { chains } from '../constants';
import { toBaseUnit, toBigNumber } from '../helpers';
import { useAppContext } from './AppContextProvider';

const ApproveOrLockButton = () => {

    const ctx = useAppContext();

    useEffect(() => {
        if (!(ctx.userAddress && ctx.selectedToken.address && ctx.needUpdateAllowance))
            return;

        ctx.selectedToken
            .contract
            .methods
            .allowance(ctx.userAddress, ctx.lockerContract._address)
            .call()
            .then(x => {
                ctx.setAppContext({
                    tokenSpendAllowance: toBaseUnit(x.toString(), 18),
                    needUpdateAllowance: false
                })
            });
    }, [ctx.userAddress, ctx.selectedToken?.address, ctx.needUpdateAllowance])

    let baseAmount = toBaseUnit(ctx.amount.toString(), 18);
    let zero = toBigNumber(0);
    let valid = !!ctx.userAddress && !!ctx.selectedToken && baseAmount.cmp(zero) > 0 && ctx.lockUntilDate > moment().unix();
    let approved = ctx.tokenSpendAllowance > 0 && ctx.tokenSpendAllowance.cmp(zero) >= 0;
    let btnclass = `lock-button animated big-button ${!valid && "disabled"}`;

    let lockBtn = (<button
        className={btnclass}
        onClick={valid ? () => ctx.chain.provider.lock(ctx) : () => { }}>Lock</button>); //empty object for future scenarios

    let approveBtn = (<button
        className={btnclass}
        onClick={valid ? () => ctx.chain.provider.approve(ctx) : () => { }}>Approve</button>);

    return approved ? lockBtn : approveBtn;
};

export default ApproveOrLockButton;