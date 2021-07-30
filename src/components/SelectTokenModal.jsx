import React, { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import '../styles/Popup.scss'
import { useAppContext } from './AppContextProvider';
import { web3 } from "../web3provider"

const SelectToken = ({ tokenList, renderButton }) => {
    const ctx = useAppContext();
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

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
                                    ctx.setAppContext({ selectedToken: await ctx.chain.provider.selectToken(token) })
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

export default SelectToken;