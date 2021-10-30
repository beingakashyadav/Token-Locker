import React, { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import '../styles/Modal.scss'
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../reduxSlices/tokenSelectorSlice';
import { getWeb3 } from '../web3provider';
import { getErc20Abi } from '../helpers';

const SelectTokenModal = () => {
    const { tokenSelectorSlice, externalDataSlice } = useSelector(state => state);
    const dispatch = useDispatch();
    
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);


    const fullTokenList = [ 
        externalDataSlice.nativeCurrency, 
        ...externalDataSlice.tokenList 
    ];
    const [shownTokens, setShownTokens ] = useState(fullTokenList);

    return (
        <>
            <button className="big-button" onClick={onOpenModal}>
                <span>{tokenSelectorSlice.selectedToken.ticker} ▼</span>
            </button>
            <Modal
                open={open}
                onClose={onCloseModal}
                center
                classNames={{
                    overlay: 'custom-overlay',
                    modal: 'custom-modal',
                }}>
                <div>
                    <div>
                        Select Token
                    </div> 
                    <div className="find-token">
                        <input className="big-input find-token-input" 
                            placeholder="Find token or paste contract"
                            onChange={async (event) => {                             
                                let userInput = event.target.value.toLowerCase();

                                if (userInput.length === 42 && 
                                    userInput.toLowerCase().startsWith("0x")) {
                                        let importedToken = await loadTokenByContractAddress(userInput);
                                        setShownTokens([ importedToken ]);
                                        return;
                                }

                                if (!userInput)
                                    setShownTokens(fullTokenList);

                                let filtered = fullTokenList.filter(token => {
                                    let ticker = token.ticker.toLowerCase();
                                    let name = token.name.toLowerCase();

                                    return ticker.startsWith(userInput) ||
                                           name.startsWith(userInput);
                                });
                                
                                setShownTokens(filtered);
                            }}
                        />
                    </div>
                    <div className="tokenlist">
                        {shownTokens.map(token => { 
                            return (<div key={token.address || token.ticker} className="tokenlist-token">
                                <button className={"big-button"} onClick={async () => {
                                    dispatch(selectToken(token));
                                    onCloseModal();
                                }}>
                                    {`${token.name} (${token.ticker})`}
                                </button>
                            </div>);
                        })}
                    </div>
                </div>
            </Modal>
        </>
    )
};

const loadTokenByContractAddress = async (address) => {
    let web3 = await getWeb3();
    let abi = await getErc20Abi();

    let contract = new web3.eth.Contract(abi, address);

    let name = await contract.methods.name().call();
    let totalSupply = await contract.methods.totalSupply().call();
    let decimals = await contract.methods.decimals().call();
    let ticker = await contract.methods.symbol().call();

    return {
        name,
        totalSupply,
        address,
        decimals,
        ticker
    }
}

export default SelectTokenModal;