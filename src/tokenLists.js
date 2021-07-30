import { ETH_GANACHE, ETH_MAINNET, ETH_ROPSTEN } from "./constants";
import Axios from 'axios';

export const getEthTokenList = async (network) => {
    switch (network) {
        case ETH_MAINNET: 
            return await getMainnetTokenlist();
        case ETH_ROPSTEN:
            return await getRoptenTokenlist();
        case ETH_GANACHE:
            return await getGanacheTokenlist();
        default:
            return []
    }
}

const getMainnetTokenlist = async () => {};
const getRoptenTokenlist = async () => {
    let request = await Axios.get("/contracts/AlpacaToken.json");
    let alpacaToken = request.data;
    return [
    { 
        name: alpacaToken.contractName,
        ticker: "ALP",
        address: alpacaToken.networks["3"].address,
        totalSupply: "200000000000000000000"
    }, 
    {
        name: "DAI (Ropsten)",
        ticker: "DAI",
        address: "0xad6d458402f60fd3bd25163575031acdce07538d",
        totalSupply: "100000000000000000000000000000000000000000000000000000000000000000000"
    }];
};

const getGanacheTokenlist = async () => {
    let request = await Axios.get("/contracts/AlpacaToken.json");
    let alpacaToken = request.data;
    return [{ 
        name: alpacaToken.contractName,
        ticker: "ALP",
        address: alpacaToken.networks["5777"].address,
        totalSupply: "200000000000000000000"
    }];
};