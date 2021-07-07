import moment from "moment";
import { useEffect } from "react";
import { shortAddress } from "../helpers";
import { useAppContext } from "./AppContextProvider"
import LoadingSpinner from "./LoadingSpinner";

const UserLocks = ({ }) => {
    const ctx = useAppContext();

    useEffect(() => {
        if (!(ctx.userAddress && ctx.needUpdateUserLocks))
            return;

        updateLocks(ctx);
    }, [ctx.userAddress, ctx.needUpdateUserLocks])

    let vaultsExist = ctx.userLocks?.length > 0;

    if (!vaultsExist)
        return (<span className="lock-label last-label"></span>)

    return (
        <>
            <span className="lock-label last-label">Your locks</span>
            <div className="lock-block user-locks">
                {ctx.userLocks.map((x, index) => (<UserLock key={Math.random()} lock={x} index={index} />))}
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
            {lock.loading ? <LoadingSpinner /> : button}
        </div>
    )
}

const claimByVaultId = (ctx, vaultId) => {
    new Promise((resolve) => {
        setVaultLoadingById(ctx, vaultId)
        resolve();
    }).then(() => {
        ctx.lockerContract
            .methods
            .claimByVaultId(vaultId)
            .send({ from: window.web3.currentProvider.selectedAddress })
            .on('receipt', () => setVaultLoadingById(ctx, vaultId));
    });
}

const setVaultLoadingById = (ctx, vaultId) => {
    let newLocks = [...ctx.userLocks];
    let current = { ...newLocks[vaultId] };
    current.loading = !current.loading;
    newLocks[vaultId] = current;
    ctx.setAppContext({ userLocks: newLocks });
}

const updateLocks = (ctx) => {
    ctx.lockerContract
        .methods
        .getUserVaults(ctx.userAddress)
        .call()
        .then(x => {
            ctx.setAppContext({
                userLocks: x.userVaults.map(y => ({
                    loading: false,
                    tokenAddress: y.tokenAddress,
                    checkpoints: y.checkpoints.map(z => ({
                        claimed: z.claimed,
                        releaseTargetTimestamp: z.releaseTargetTimestamp,
                        tokensCount: z.tokensCount
                    }))
                })),
                needUpdateUserLocks: false
            });
        });
}

export default UserLocks;