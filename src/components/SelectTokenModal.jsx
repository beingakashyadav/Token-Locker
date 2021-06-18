import React, { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import '../styles/Popup.scss'

const SelectToken = ({ selectTokenCallback, tokenList, renderButton }) => {
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
                            <div key={token.contract}>
                                <button className={"big-button"} onClick={() => {
                                    selectTokenCallback(token);
                                    onCloseModal();
                                }}>
                                    {`${token.name} - ${token.contract}`}
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