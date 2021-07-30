import Axios from 'axios';
import { ETH_GANACHE, ETH_MAINNET, ETH_ROPSTEN } from "./constants";
import Web3Utils from 'web3-utils';
import { web3 } from "./web3provider"

let erc20Abi = "";

export const shortAddress = (addr, start = 5, end = 2) =>
    `${addr.slice(0, start)}...${addr.slice(addr.length - end, addr.length)}`;

export const getLockerContract = async (network) => {
    switch (network) {
        case ETH_MAINNET:
        case ETH_ROPSTEN:
            let request1 = await Axios.get("/contracts/Locker.json");
            let locker1 = request1.data;
            return new web3.eth.Contract(locker1.abi, locker1.networks["3"].address);
        case ETH_GANACHE:
            let request = await Axios.get("/contracts/Locker.json");
            let locker = request.data;
            return new web3.eth.Contract(locker.abi, locker.networks["5777"].address);
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

export function toBaseUnit(value, decimals) {

    function isString(s) {
        return (typeof s === 'string' || s instanceof String)
    }
    const BN = Web3Utils.BN;

    if (!isString(value)) {
        throw new Error('Pass strings to prevent floating point precision issues.')
    }
    const ten = new BN(10);
    const base = ten.pow(new BN(decimals));

    // Is it negative?
    let negative = (value.substring(0, 1) === '-');
    if (negative) {
        value = value.substring(1);
    }

    if (value === '.') {
        throw new Error(
            `Invalid value ${value} cannot be converted to`
            + ` base unit with ${decimals} decimals.`);
    }

    // Split it into a whole and fractional part
    let comps = value.split('.');
    if (comps.length > 2) { throw new Error('Too many decimal points'); }

    let whole = comps[0], fraction = comps[1];

    if (!whole) { whole = '0'; }
    if (!fraction) { fraction = '0'; }
    if (fraction.length > decimals) {
        throw new Error('Too many decimal places');
    }

    while (fraction.length < decimals) {
        fraction += '0';
    }

    whole = new BN(whole);
    fraction = new BN(fraction);
    let wei = (whole.mul(base)).add(fraction);

    if (negative) {
        wei = wei.neg();
    }

    return new BN(wei.toString(10), 10);
}