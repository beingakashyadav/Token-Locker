import React, { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import '../styles/Popup.scss'
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../reduxSlices/tokenSelectorSlice';

const SelectTokenModal = () => {
    const { tokenSelectorSlice, externalDataSlice } = useSelector(state => state);
    const dispatch = useDispatch();

    const nativeCurrency = externalDataSlice.nativeCurrency;

    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

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
                    overlay: 'customOverlay',
                    modal: 'customModal',
                }}>
                <div>
                    <div>
                        Select Token
                    </div>
                    <div>
                        <button className={"big-button"} onClick={async () => {
                            dispatch(selectToken(nativeCurrency))
                            onCloseModal();
                        }}>
                            {`${nativeCurrency.name} (${nativeCurrency.ticker})`}
                        </button>
                    </div>
                    <div>
                        {externalDataSlice.tokenList.map(token => { 
                            return (<div key={token.address}>
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

export default SelectTokenModal;