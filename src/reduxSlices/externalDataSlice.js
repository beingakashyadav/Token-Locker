import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getLockerContract } from '../helpers';
import { getEthTokenList, getNativeCurrency } from '../tokenLists';

const initialState = {
    externalDataLoaded: false,
    tokenList: [],
    locker: {},
    nativeCurrency: {}
};

export const fetchExternalData = createAsyncThunk(
    'externalData/fetchExternalData',
    async () => {
        let list = await getEthTokenList();
        let contract = await getLockerContract();
        let nativeCurrency = await getNativeCurrency();
        return { tokenList: list, lockerContract: contract, nativeCurrency };
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
                state.externalDataLoaded = true;
            });
    },
});

export default externalDataSlice.reducer;
