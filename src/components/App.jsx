import React, { useEffect } from 'react';
import "../styles/App.scss";
import "../styles/Buttons.scss";
import "../styles/Inputs.scss";
import { useAppContext } from './AppContextProvider';
import NetworkSelector from './NetworkSelector';
import ApproveOrLockButton from './ApproveOrLockButton';
import TokenSelector from './TokenSelector';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import UserLocks from "./UserLocks"
import { getLockerContract } from '../helpers';
import { getEthTokenList } from '../tokenLists';
import { ETH_GANACHE, ETH_ROPSTEN } from '../constants';
import Web3 from 'web3';
const web3 = new Web3(window.ethereum);

const App = () => {
    const ctx = useAppContext();

    useEffect(() => {
        if (ctx.externalDataLoaded)
            return;

        const loadData = async () => {
            let networkId = await web3.eth.net.getId();
            let locker = await getLockerContract(networkId);
            let tokenlist = await getEthTokenList(networkId);

            ctx.setAppContext({
                coinsToSelect: tokenlist,
                lockerContract: locker,
                externalDataLoaded: true,
                networkId: networkId
            })
        }
        loadData();
    }, [ctx.externalDataLoaded]);

    if (!ctx.externalDataLoaded)
        return null;

    if (ctx.networkId !== ETH_ROPSTEN && ctx.networkId !== ETH_GANACHE)
        return ("Switch network to Ropsten in MetaMask")

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
                            onChange={(e) => ctx.setAppContext({ lockUntilDate: e instanceof moment && e.unix() })} />
                    </div>
                    <ApproveOrLockButton />
                    <UserLocks />
                </div>
            </div>
        </>
    );
}

export default App;