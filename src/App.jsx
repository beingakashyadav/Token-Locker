import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

function App() {
    const [address, setAddress] = useState('');
    const [contracts, setContracts] = useState([]);
    const web3 = new Web3(window.ethereum);
    const address1 = "0x2f79D15273E33371F71640a25585C5B9DB7FC1A3";
    const address2 = "0x005B71Af629C5B72DAd29acFB08AE98a1E8c9bE1";
    const address3 = "0xe01C5016bd81289975dB0C068D5a5b2eA43c2bB9";
    let valueInput = React.createRef();

    useEffect(() => {
        Promise.all([
            fetch('/contracts/AlpacaToken.json'),
            fetch('/contracts/LlamaToken.json'),
            fetch('/contracts/Exchange.json')
        ]).then(async ([alp, llama, exc]) => {
            let getData = async (json) => {
                let data = await json.json();
                return [
                    data.abi,
                    data.networks["5777"].address
                ]
            }
            setContracts({
                alpaca: new web3.eth.Contract(...(await getData(alp))),
                llama: new web3.eth.Contract(...(await getData(llama))),
                exchange: new web3.eth.Contract(...(await getData(exc)))
            })

        })
    }, []);

    let setValue = async () => {
        await balances();
        let vlt = await contracts
            .exchange
            .methods
            .createVault(address1, contracts.alpaca._address, "10000000000000000", address2, contracts.llama._address, "20000000000000000")
            .send({ from: window.web3.currentProvider.selectedAddress })
        console.log(vlt);

        let createdvlt = await contracts.exchange.methods.swapTokens("1").send({ from: window.web3.currentProvider.selectedAddress });
        console.log(createdvlt);
        await balances();
        
        

    };
    // let connect = () => {
    //     if (typeof window.ethereum === 'undefined' || address)
    //         return;

    //     window.ethereum
    //         .request({ method: 'eth_requestAccounts' })
    //         .then(x => {
    //             setAddress(x[0]);
    //         });
    // };

    // let setValue = () => {
    //     if (!contracts)
    //         return;

    // contract.methods
    //   .createVault("0x288134424520caadf321ad1a7dbd4f11665ea22c", "0x288134424520caadf321ad1a7dbd4f11665ea22c", "0x288134424520caadf321ad1a7dbd4f11665ea22c", "0x288134424520caadf321ad1a7dbd4f11665ea22c")
    //   .send({
    //     from: window.web3.currentProvider.selectedAddress,
    //     gasPrice: '20000000000'
    //   })
    //   .then(x => console.log(x));
    //contract.methods.balanceOf("0x2f79D15273E33371F71640a25585C5B9DB7FC1A3").call().then(x => console.log(x));
    //     contracts
    //         .methods
    //         .approve("0x005B71Af629C5B72DAd29acFB08AE98a1E8c9bE1", "1000000000000000000")
    //         .call({
    //             from: window.web3.currentProvider.selectedAddress,
    //             gasPrice: '20000000000'
    //         })
    //         .then(x => {
    //             console.log(x);
    //             contracts.methods.transferFrom("");
    //         });
    // };

    // let getValue = () => {
    //   if (!contract)
    //     return;

    //   contract.methods.balanceOf("0x288134424520caadf321ad1a7dbd4f11665ea22c").call().then(x => console.log(x))
    // };
    let connect = () => {
        if (typeof window.ethereum === 'undefined' || address)
            return;

        window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(x => {
                setAddress(x[0]);
            });
    };
    let balances = async () => {
        console.log("addr1 alp " + await contracts.alpaca.methods.balanceOf(address1).call());
        console.log("addr1 llama " + await contracts.llama.methods.balanceOf(address1).call());
        console.log("addr2 alp " + await contracts.alpaca.methods.balanceOf(address2).call());
        console.log("addr2 llama " + await contracts.llama.methods.balanceOf(address2).call());
        console.log("addr3 alp " + await contracts.alpaca.methods.balanceOf(address3).call());
        console.log("addr3 llama " + await contracts.llama.methods.balanceOf(address3).call());
    }

    let approve1 = async () => {
        let approve = await contracts
            .llama
            .methods
            .approve(contracts.exchange._address, "10000000000000000000000")
            .send({ from: window.web3.currentProvider.selectedAddress });

        console.log(approve);
    }

    let approve2 = async () => {
        contracts
            .alpaca
            .methods
            .approve(contracts.exchange._address, "10000000000000000000000")
            .send({ from: window.web3.currentProvider.selectedAddress })
            .then(x => console.log(x))

        
    }

    return (
        <div className="App">
            <button onClick={() => connect()}>
                {address.slice(0, 6) || 'Connect to Metamask'}
            </button>
            <br></br>
            <input ref={valueInput} />
            <button onClick={async () => await setValue()}>action</button>
            <button onClick={async () => await approve1()}>approve 1 firefox</button>
            <button onClick={async () => await approve2()}>approve 2 chrome</button>
        </div>
    );
}

export default App;