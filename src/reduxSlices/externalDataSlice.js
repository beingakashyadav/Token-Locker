import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getLockerContract } from '../helpers';
import { getEthTokenList, getNativeCurrency } from '../tokenLists';
import { getWeb3 } from '../web3provider';

const initialState = {
    externalDataLoaded: false,
    tokenList: [],
    locker: {},
    nativeCurrency: {},
    chainId: -1
};

export const fetchExternalData = createAsyncThunk(
    'externalData/fetchExternalData',
    async () => {
        let list = await getEthTokenList();
        let contract = await getLockerContract();
        let nativeCurrency = await getNativeCurrency();
        let chainId = await (await getWeb3()).eth.getChainId();
        return { tokenList: list, lockerContract: contract, nativeCurrency, chainId  };
    }
);

export const externalDataSlice = createSlice({
    name: 'externalDataSlice',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchExternalData.fulfilled, (state, action) => {
                state.tokenList = [ ...action.payload.tokenList ];
                state.locker= action.payload.lockerContract;
                state.nativeCurrency = action.payload.nativeCurrency;
                state.chainId = action.payload.chainId;
                state.externalDataLoaded = true;
            });
    },
});

export default externalDataSlice.reducer;
