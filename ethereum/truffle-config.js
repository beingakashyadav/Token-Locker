const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = require("./private.json").mnemonic;
const endpoints = require("./private.json").endpoints;

module.exports = {
    contracts_build_directory: "../public/contracts",
    networks: {
        dev: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*"
        },
        dev2: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*"
        },
        ropsten: {
            provider: function () {
                return new HDWalletProvider(mnemonic, endpoints.ropsten)
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
