const Alpaca = artifacts.require("AlpacaToken");
const Llama = artifacts.require("LlamaToken");
const Exchange = artifacts.require("Exchange");
const fs = require('fs');

module.exports = async function (deployer) {

    deployer.deploy(Alpaca, "Alpaca Token", "ALP");
    deployer.deploy(Llama, "Llama Token", "Llama");
    deployer.deploy(Exchange);

    // Promise.all([
    //     Alpaca.deployed(),
    //     Llama.deployed(),
    //     Exchange.deployed()
    // ])
    //     .then(([alpaca, llama, exchange]) => {
    //         let jsonData = {
    //             AlpacaToken: alpaca.address,
    //             LlamaToken: llama.address,
    //             Exchange: exchange.address
    //         }

    //         fs.writeFile("./frontend/public/contracts/addresses.json", 
    //                      JSON.stringify(jsonData), 
    //                      (err) => err && console.log(err));
    //     });
};
