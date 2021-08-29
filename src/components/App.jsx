import React, { useEffect } from 'react';
import "../styles/App.scss";
import "../styles/Buttons.scss";
import "../styles/Inputs.scss";
import NetworkSelector from './NetworkSelector';
import ApproveLockButton from './ApproveLockButton';
import TokenSelector from './TokenSelector';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import UserLocks from "./UserLocks"
import { useDispatch, useSelector } from 'react-redux';
import { fetchExternalData } from '../reduxSlices/externalDataSlice';
import { clearApproval, setLockUntil } from '../reduxSlices/tokenSelectorSlice';

const App = () => {
    const dataState = useSelector(state => state.externalDataSlice);
    const dispatch = useDispatch();

    useEffect(() => {
        if (dataState.externalDataLoaded)
            return;

        dispatch(fetchExternalData());
    }, [dispatch, dataState.externalDataLoaded])

    if (!dataState.externalDataLoaded)
        return ("Loading...");

    window.clearApproval = () => dispatch(clearApproval())
    
    return (
        <>
            <NetworkSelector />
            <div className="lock">
                <div className="lock-blocks">
                    <span className="lock-label first-label">Select token to lock</span>
                    <div className="lock-block swap-addresses-from">
                        <TokenSelector />
                    </div>
                    <span className="lock-label">Select date to lock until</span>
                    <div className="lock-block">
                        <Datetime
                            isValidDate={current => (current.isAfter(moment().subtract(1, "day")))}
                            onChange={(e) => e instanceof moment && dispatch(setLockUntil(e.unix()))} />
                    </div>
                    <ApproveLockButton />
                    <UserLocks />
                </div>
            </div>
        </>
    );
}


// const App = () => {
//     const ctx = useAppContext();
//     const metamaskInstalled = !!(typeof web3 !== 'undefined' && web3?.currentProvider?.isMetaMask);

//     useEffect(() => {
//         if (ctx.externalDataLoaded || !metamaskInstalled)
//             return;

//         (async () => {
//             let networkId = await web3.eth.net.getId();
//             if (!checkNetwork(networkId))
//                 return;

//             let locker = await getLockerContract(networkId);
//             let tokenlist = await getEthTokenList(networkId);

//             ctx.setAppContext({
//                 coinsToSelect: tokenlist,
//                 selectedToken: await ctx.chain.provider.addContract(tokenlist[0]),
//                 lockerContract: locker,
//                 externalDataLoaded: true,
//                 networkId: networkId
//             });

//         })();
//     }, [ctx.externalDataLoaded]);

//     if (!checkNetwork(ctx.networkId))
//         return ("Switch network to Ropsten or BSC in MetaMask");

//     if (!ctx.externalDataLoaded)
//         return ("Loading...");

//     return (
//         <>
//             <NetworkSelector />
//             <div className="lock">
//                 <div className="lock-blocks">
//                     <span className="lock-label first-label">Select token to lock</span>
//                     <div className="lock-block swap-addresses-from">
//                         <TokenSelector />
//                     </div>
//                     <span className="lock-label">Select date to lock until</span>
//                     <div className="lock-block">
//                         <Datetime
//                             isValidDate={current => (current.isAfter(moment().subtract(1, "day")))}
//                             onChange={(e) => ctx.setAppContext({ lockUntilDate: e instanceof moment && e.unix() })} />
//                     </div>
//                     <ApproveOrLockButton />
//                     <UserLocks />
//                 </div>
//             </div>
//         </>
//     );
// }

export default App;