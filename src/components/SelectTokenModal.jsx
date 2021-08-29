import React, { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import '../styles/Popup.scss'
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../reduxSlices/tokenSelectorSlice';
import { shortAddress } from '../helpers';

const SelectTokenModal = () => {
    const tokenSelectorState = useSelector(state => state.tokenSelectorSlice);
    const dispatch = useDispatch();

    const externalDataSlice = useSelector(state => state.externalDataSlice);
    const tokenList = externalDataSlice.tokenList;
    const nativeCurrency = externalDataSlice.nativeCurrency;

    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

    return (
        <>
            <button className="big-button" onClick={onOpenModal}>
                <span>{tokenSelectorState.selectedToken.ticker} ▼</span>
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
                            dispatch(selectToken({ ...nativeCurrency, native: true }))
                            onCloseModal();
                        }}>
                            {`${nativeCurrency.ticker}`}
                        </button>
                    </div>
                    <div>
                        {tokenList.map(token => renderToken(token, onCloseModal, dispatch))}
                    </div>
                </div>
            </Modal>
        </>
    )
};

const renderToken = (token, onCloseModal, dispatch) => {
    return (<div key={token.address}>
        <button className={"big-button"} onClick={async () => {
            dispatch(selectToken(token));
            onCloseModal();
        }}>
            {`${token.name} - ${shortAddress(token.address, 6, 6)}`}
        </button>
    </div>);
}

export default SelectTokenModal;