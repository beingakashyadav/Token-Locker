import React, { useEffect } from 'react';
import "../styles/App.scss";
import "../styles/Buttons.scss";
import "../styles/Inputs.scss";
import { useAppContext } from './AppContextProvider';
import Axios from 'axios';
import Web3 from 'web3';
import NetworkSelector from './NetworkSelector';
import ApproveOrLockButton from './ApproveOrLockButton';
import TokenSelector from './TokenSelector';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import UserLocks from "./UserLocks"
const web3 = new Web3(window.ethereum);

const App = () => {
    const ctx = useAppContext();

    useEffect(() => {
        if (ctx.externalDataLoaded)
            return;

        Promise.all([
            Axios.get("/contracts/Locker.json"),
            Axios.get("/contracts/AlpacaToken.json")
        ]).then(([res1, res2]) => {
            let locker = res1.data;
            let alpaca = res2.data;
            let tokens = [{ name: alpaca.contractName, ticker: "ALP", contract: alpaca.networks["5777"].address }];
            ctx.setAppContext({
                coinsToSelect: tokens,
                contracts: {
                    alpaca: new web3.eth.Contract(alpaca.abi, alpaca.networks["5777"].address),
                    locker: new web3.eth.Contract(locker.abi, locker.networks["5777"].address)
                },
                selectedToken: tokens[0],
                externalDataLoaded: true
            })
        });
    }, [ctx]);

    useEffect(() => {
        if ((!ctx.userAddress || !ctx.selectedToken.contract) && ctx.needUpdateAllowance)
            return;

        let contract = Object.entries(ctx.contracts).find(x => x[1]._address === ctx.selectedToken.contract)[1];

        contract.methods
            .allowance(ctx.userAddress, ctx.contracts.locker._address)
            .call()
            .then(x => { ctx.setAppContext({ tokenSpendAllowance: Number.parseInt(x), needUpdateAllowance: false }) });
    }, [ctx.needUpdateAllowance])

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
                            onChange={(e) => ctx.setAppContext({ lockUntil: e instanceof moment && e.unix() })} />
                    </div>
                    <ApproveOrLockButton />
                    <UserLocks />
                </div>
            </div>
        </>
    );
}

export default App;