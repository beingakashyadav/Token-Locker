import Axios from 'axios';
import { ETH_GANACHE, ETH_MAINNET, ETH_ROPSTEN } from "./constants";
import Web3Utils from 'web3-utils';
import { getWeb3 } from './web3provider';

let erc20Abi = "";

export const checkNetwork = (networkId) =>
(networkId === ETH_ROPSTEN ||
    networkId === ETH_GANACHE);

export const shortAddress = (addr, start = 5, end = 2) =>
    `${addr.slice(0, start)}...${addr.slice(addr.length - end, addr.length)}`;

export const getLockerContract = async () => {
    let web3 = await getWeb3();
    let network = await web3.eth.getChainId();

    switch (network) {
        case ETH_MAINNET:
        case ETH_ROPSTEN:
            let request1 = await Axios.get("/contracts/Locker.json");
            let locker1 = request1.data;
            return {
                abi: locker1.abi,
                address: locker1.networks["3"].address
            };
        case ETH_GANACHE:
            let request = await Axios.get("/contracts/Locker.json");
            let locker = request.data;
            return {
                abi: locker.abi,
                address: locker.networks["5777"].address
            };
        default:
            return []
    }
}

export const getErc20Abi = async () => {
    if (erc20Abi) return erc20Abi;

    let request = await Axios.get("/ERC20_abi.json");
    erc20Abi = request.data;
    return erc20Abi;
}

export const toBigNumber = (number) => new Web3Utils.BN(number);
export const fromBaseUnit = (value) => Web3Utils.fromWei(value);
export const toBaseUnit = (value) => Web3Utils.toWei(new Web3Utils.BN(value));