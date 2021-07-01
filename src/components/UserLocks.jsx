import moment from "moment";
import { useEffect } from "react";
import { shortAddress } from "../helpers";
import { useAppContext } from "./AppContextProvider"

const UserLocks = ({ }) => {
    const ctx = useAppContext();

    useEffect(() => {
        if (!(ctx.userAddress && ctx.needUpdateUserLocks))
            return;

        updateLocks(ctx);
    }, [ctx.userAddress, ctx.needUpdateUserLocks])

    let vaultsExist = ctx.userLocks?.userVaults?.length > 0;

    if (!vaultsExist)
        return (<span className="lock-label last-label"></span>)

    return (
        <>
            <span className="lock-label last-label">Your locks</span>
            <div className="lock-block user-locks">
                {ctx.userLocks.userVaults.map((x, index) => (<UserLock key={Math.random()} lock={x} index={index} />))}
            </div>
        </>
    )
}

const UserLock = ({ lock, index }) => {
    let ctx = useAppContext();
    let availableToClaim = lock.checkpoints[0].releaseTargetTimestamp <= moment().unix();
    let untilDate = moment.unix(lock.checkpoints[0].releaseTargetTimestamp).format("DD/MM/YY HH:mm");
    let claimed = lock.checkpoints[0].claimed;
    let btnclass = `big-button userlock-claim ${(!availableToClaim || claimed) && "disabled"}`;

    let button = (
        <button 
            className={btnclass} 
            onClick={() => !(!availableToClaim || claimed) && claimByVaultId(ctx, index)}>
            {claimed ? "Claimed" : "Claim"}
        </button>
    );

    return (
        <div className="user-lock">
            <div className="userlock-label">
                {`${shortAddress(lock.tokenAddress)} - until ${untilDate}`}
            </div>
            {button}
        </div>
    )
}

const claimByVaultId = (ctx, vaultId) => {
    ctx.lockerContract
        .methods
        .claimByVaultId(vaultId)
        .send({ from: window.web3.currentProvider.selectedAddress })
        .on('receipt', () => updateLocks(ctx));
}

const updateLocks = (ctx) => {  
    ctx.lockerContract
        .methods
        .getUserVaults(ctx.userAddress)
        .call()
        .then(x => ctx.setAppContext({ userLocks: x, needUpdateUserLocks: false }));
}

export default UserLocks;