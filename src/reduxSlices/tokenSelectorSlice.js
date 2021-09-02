import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getErc20Abi, getLockerContract, toBaseUnit } from '../helpers';
import { getWeb3 } from '../web3provider';
import { getUserLocks } from './userLocksSlice';

const initialState = {
    selectedToken: {},
    approvedAmount: 0,
    amount: "0",
    balance: 0,
    lockUntil: 0,
    isApproveLockLoading: false
};

export const approveToken = createAsyncThunk(
    'tokenSelector/approveToken',
    async (_, thunkApi) => {
        try {
            let state = thunkApi.getState();

            let web3 = await getWeb3();
            let locker = await getLockerContract();
            let tokenContract = new web3.eth.Contract(await getErc20Abi(), state.tokenSelectorSlice.selectedToken.address);
            let totalSupply = state.tokenSelectorSlice.selectedToken.totalSupply;

            await tokenContract
                .methods
                .approve(locker.address, totalSupply)
                .send({ from: window.ethereum.selectedAddress });

            return totalSupply;
        }
        catch (e) { console.log(e) }
    }
);

export const lockToken = createAsyncThunk(
    'tokenSelector/lockToken',
    async (_, thunkApi) => {
        try {
            let state = thunkApi.getState();
            let web3 = await getWeb3();
            let locker = await getLockerContract();
            let lockerContract = new web3.eth.Contract(locker.abi, locker.address);

            if (state.tokenSelectorSlice.selectedToken.native) {
                await lockerContract
                    .methods
                    .lockNativeCurrency(state.tokenSelectorSlice.lockUntil.toString())
                    .send({ from: window.ethereum.selectedAddress, value: toBaseUnit(state.tokenSelectorSlice.amount) })
            }
            else {
                await lockerContract
                    .methods
                    .lock(state.tokenSelectorSlice.lockUntil.toString(), state.tokenSelectorSlice.selectedToken.address, toBaseUnit(state.tokenSelectorSlice.amount))
                    .send({ from: window.ethereum.selectedAddress })
            }
            await thunkApi.dispatch(getUserLocks({ userAddress: state.networkSlice.userAddress }))
            await thunkApi.dispatch(getSelectedTokenBalance({
                tokenAddress: state.tokenSelectorSlice.selectedToken.address,
                userAddress: state.networkSlice.userAddress,
                isNativeCurrency: state.tokenSelectorSlice.selectedToken.native
            }))
            await thunkApi.dispatch(clearAmount())

        }
        catch (e) { console.log(e) }
    }
);

export const getSelectedTokenBalance = createAsyncThunk(
    'tokenSelector/getSelectedTokenBalance',
    async ({ tokenAddress, userAddress, isNativeCurrency }) => {
        try {
            let web3 = await getWeb3();

            if (isNativeCurrency) {
                let balance = await web3.eth.getBalance(userAddress);
                return balance.toString();
            }
            else {
                let tokenContract = new web3.eth.Contract(await getErc20Abi(), tokenAddress);
                let balance = await tokenContract.methods.balanceOf(userAddress).call();
                return balance;
            }
        }
        catch (e) { console.log(e) }
    }
);

export const getSelectedTokenApproval = createAsyncThunk(
    'tokenSelector/getSelectedTokenApproval',
    async ({ spenderAddress, userAddress, selectedTokenAddress }) => {
        try {
            let web3 = await getWeb3();
            let selectedTokenContract = new web3.eth.Contract(await getErc20Abi(), selectedTokenAddress);

            let allowance = await selectedTokenContract
                .methods
                .allowance(userAddress, spenderAddress)
                .call();

            return allowance.toString();
        }
        catch (e) { console.log(e) }
    }
);

export const clearApproval = createAsyncThunk(
    'tokenSelector/approveToken',
    async (_, thunkApi) => {
        try {
            let state = thunkApi.getState();

            let web3 = await getWeb3();
            let locker = await getLockerContract();
            let tokenContract = new web3.eth.Contract(await getErc20Abi(), state.tokenSelectorSlice.selectedToken.address);
            let totalSupply = state.tokenSelectorSlice.selectedToken.totalSupply;

            await tokenContract
                .methods
                .approve(locker.address, "0")
                .send({ from: window.ethereum.selectedAddress });

            return totalSupply;
        }
        catch (e) { console.log(e) }
    }
);

export const tokenSelectorSlice = createSlice({
    name: 'tokenSelectorSlice',
    initialState,
    reducers: {
        setTokenAmount: (state, action) => {
            state.amount = action.payload;
        },
        selectToken: (state, action) => {
            state.selectedToken = { ...action.payload }
        },
        setLockUntil: (state, action) => {
            state.lockUntil = action.payload
        },
        clearAmount: (state) => {
            state.amount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSelectedTokenBalance.fulfilled, (state, action) => {
                state.balance = action.payload
            })
            .addCase(getSelectedTokenApproval.fulfilled, (state, action) => {
                state.approvedAmount = action.payload
            })
            .addCase(approveToken.fulfilled, (state, action) => {
                state.approvedAmount = action.payload;
                state.isApproveLockLoading = false;
            })
            .addCase(approveToken.rejected, (state) => {
                state.isApproveLockLoading = false;
            })
            .addCase(approveToken.pending, (state) => {
                state.isApproveLockLoading = true;
            })
            .addCase(lockToken.fulfilled, (state, action) => {
                state.isApproveLockLoading = false;
            })
            .addCase(lockToken.pending, (state, action) => {
                state.isApproveLockLoading = true;
            })
            .addCase(lockToken.rejected, (state, action) => {
                state.isApproveLockLoading = false;
            });
    }
});

export const {
    setTokenAmount,
    selectToken,
    setLockUntil,
    setApproved,
    clearAmount
} = tokenSelectorSlice.actions;

export default tokenSelectorSlice.reducer;
