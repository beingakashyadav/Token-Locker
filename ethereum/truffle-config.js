const HDWalletProvider = require("@truffle/hdwallet-provider");

//test addr 0x2f79D15273E33371F71640a25585C5B9DB7FC1A3
const mnemonic = "current silent give horn actual lazy usual flower speed muscle toward deliver";

module.exports = {
    contracts_build_directory: "../public/contracts",
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*"
        },
        ropsten: {
            provider: function () {
                return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/465f054881974d14a17defb11c140a42")
            },
            network_id: 3,
            gas: 1500000
        }
    },
    compilers: {
        solc: {
            version: '0.8.1'
        }
    }
};
