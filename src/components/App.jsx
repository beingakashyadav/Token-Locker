import React, { useContext, useEffect, useRef, useState } from 'react';
import Web3 from 'web3';
import AppContext from '../context';

function App() {

    // const ctx = useRef(useContext(AppContext));
    // console.log(ctx);

    // useEffect(() => {
    //     ctx.current.setAppContext({ ...ctx, address: "123" });
    // }, []);
    const ctx = useContext(AppContext);

    useEffect(() => {
        if (ctx.address)
            return;

        ctx.setAppContext({ ...ctx, address: "123" });
    }, [ctx]);

    return (
        <>
            <div>
                {useContext(AppContext).address}
            </div>
            <Asd />
        </>
    );
}


function Asd() {

    return (
        <div>
            {useContext(AppContext).address}
        </div>
    )
}

export default App;