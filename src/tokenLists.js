import { ETH_BSC, ETH_GANACHE, ETH_MAINNET, ETH_ROPSTEN } from "./constants";
import { getWeb3 } from "./web3provider";

//todo pass network as dependency
export const getEthTokenList = async () => {
    let web3 = await getWeb3();
    let network = await web3.eth.getChainId();

    switch (network) {
        case ETH_MAINNET:
            return [];
        case ETH_ROPSTEN:
            return [
                {
                    name: "Alpaca Token",
                    ticker: "ALP",
                    address: "0x39edf0b19acfde5c1a1d0272acdde0aa1bb29e62",
                    totalSupply: "200000000000000000000"
                },
                {
                    name: "DAI",
                    ticker: "DAI",
                    address: "0xad6d458402f60fd3bd25163575031acdce07538d",
                    totalSupply: "100000000000000000000000000000000000000000000000000000000000000000000"
                },
                {
                    name: "Uniswap",
                    ticker: "UNI",
                    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
                    totalSupply: "1000000000000000000000000000"
                }]
        case ETH_GANACHE:
            return [{
                name: "Alpaca Token",
                ticker: "ALP",
                address: "0xFe7bA2E9C18c7Eb318A66b5f6CD57A5c3F4e4a32",
                totalSupply: "200000000000000000000"
            }];
        default:
            return []
    }
}

export const getNativeCurrency = async () => {
    let web3 = await getWeb3();
    let network = await web3.eth.getChainId();

    switch (network) {
        case ETH_MAINNET:
        case ETH_ROPSTEN:
        case ETH_GANACHE:
            return {
                name: "Ethereum",
                ticker: "ETH",
                native: true
            }
        case ETH_BSC:
            return {
                name: "Binance Coin",
                ticker: "BNB",
                native: true
            }
        default:
            return []
    }
}