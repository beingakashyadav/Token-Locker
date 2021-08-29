import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shortAddress } from "../helpers";
import { tokenSelectorSlice } from "../reduxSlices/tokenSelectorSlice";
import { claimByVaultId, getUserLocks } from "../reduxSlices/userLocksSlice";
import LoadingSpinner from "./LoadingSpinner";

const UserLocks = () => {
    const dispatch = useDispatch();
    const userLocksSlice = useSelector(state => state.userLocksSlice);
    const networkSlice = useSelector(state => state.networkSlice);

    useEffect(() => {
        if (!networkSlice.userAddress)
            return;

        dispatch(getUserLocks({ userAddress: networkSlice.userAddress }));
    }, [networkSlice.userAddress, dispatch])

    let vaultsExist = userLocksSlice.userLocks?.length > 0;

    if (!vaultsExist || !networkSlice.userAddress)
        return (<span className="lock-label last-label"></span>)

    return (
        <>
            <span className="lock-label last-label">Your locks</span>
            <div className="lock-block user-locks">
                {userLocksSlice.userLocks.map((x, index) => 
                    (<UserLock key={index} lock={x} index={index} />))}
            </div>
        </>
    )
}

const UserLock = ({ lock, index }) => {
    const dispatch = useDispatch();
    const externalDataSlice = useSelector(state => state.externalDataSlice);
    let availableToClaim = lock.checkpoints[0].releaseTargetTimestamp <= moment().unix();
    let untilDate = moment.unix(lock.checkpoints[0].releaseTargetTimestamp).format("DD/MM/YY HH:mm");
    let claimed = lock.checkpoints[0].claimed;
    let btnclass = `big-button userlock-claim ${(!availableToClaim || claimed) && "disabled"}`;

    let button = (
        <button
            className={btnclass}
            onClick={async () => {
                if (!availableToClaim || claimed)
                    return;

                await dispatch(claimByVaultId({ vaultId: index }));
            }}
        >
            {claimed ? "Claimed" : "Claim"}
        </button >
    );

    let tokenName = externalDataSlice.tokenList.find(x => x.address === lock.tokenAddress).name || 
                    shortAddress(lock.tokenAddress);

    return (
        <div className="user-lock">
            <div className="userlock-label">
                {`${tokenName} - until ${untilDate}`}
            </div>
            {lock.loading ? <LoadingSpinner /> : button}
        </div>
    )
}

export default UserLocks;