import ethereum from "./chainProviders/ethereum";
import terra from "./chainProviders/terra";

export const chains = [
{ 
    name: "eth",
    nativeCurrency: [ "ETH" ],
    provider: ethereum
}, 
{ 
    name: "bsc",
    nativeCurrency: [ "BNB" ],
    provider: ethereum
}, 
{ 
    name: "terra",
    nativeCurrency: [ "LUNA", "UST", "KRT" ],
    provider: terra
}];

export const ETH_MAINNET = 1;
export const ETH_ROPSTEN = 3;
export const ETH_GANACHE = 5777;
export const ETH_BSC = 56;