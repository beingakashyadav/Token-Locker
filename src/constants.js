import ethereum from "./chainProviders/ethereum";
import terra from "./chainProviders/terra";

export const chains = [
{ 
    name: "eth",
    provider: ethereum
}, 
{ 
    name: "terra",
    provider: terra
}];

export const ETH_MAINNET = 1;
export const ETH_ROPSTEN = 3;
export const ETH_GANACHE = 5777;