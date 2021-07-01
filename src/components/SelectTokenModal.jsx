import React, { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import Web3 from 'web3';
import { getErc20Abi } from '../helpers';
import '../styles/Popup.scss'
import { useAppContext } from './AppContextProvider';
const web3 = new Web3(window.ethereum);

const SelectToken = ({ selectTokenCallback, tokenList, renderButton }) => {
    const ctx = useAppContext();
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

    useEffect(() => {
        if (ctx.selectedToken)
            return;

        selectToken(tokenList[0], selectTokenCallback);
    }, [ctx.selectedToken])

    return (
        <>
            {renderButton(onOpenModal)}
            <Modal
                open={open}
                onClose={onCloseModal}
                center
                classNames={{
                    overlay: 'customOverlay',
                    modal: 'customModal',
                }}>
                <div>
                    <div>
                        Select Token
                    </div>
                    <div>
                        {tokenList.map(token => (
                            <div key={token.address}>
                                <button className={"big-button"} onClick={async () => {
                                    await selectToken (token, selectTokenCallback);
                                    onCloseModal();
                                }}>
                                    {`${token.name} - ${token.address}`}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    )
};

const selectToken = async (token, selectTokenCallback) => {
    let contract = new web3.eth.Contract(await getErc20Abi(), token.address);
    selectTokenCallback({ ...token, contract });
}

export default SelectToken;