import { getErc20Abi, toBaseUnit } from "../helpers";
import { web3 } from '../web3provider';

const ethereum = {
    approve: (ctx) => {
        ctx.selectedToken
            .contract
            .methods
            .approve(ctx.lockerContract._address, ctx.selectedToken.totalSupply)
            .send({ from: window.web3.currentProvider.selectedAddress })
            .on('receipt', () => {
                ctx.setAppContext({ tokenSpendAllowance: ctx.amount })
            });
    },
    lock: (ctx) => {
        ctx.lockerContract
            .methods
            .lock(ctx.lockUntilDate, ctx.selectedToken.address, toBaseUnit(ctx.amount.toString(), 18)) //need to get token decimals from somewhere
            .send({ from: window.web3.currentProvider.selectedAddress })
            .on('receipt', () => {
                ctx.setAppContext({ needUpdateUserLocks: true, needUpdateAllowance: true });
            });
    },
    selectToken: async (token) => {
        let contract = new web3.eth.Contract(await getErc20Abi(), token.address);
        return { ...token, contract };
    }
}

export default ethereum;