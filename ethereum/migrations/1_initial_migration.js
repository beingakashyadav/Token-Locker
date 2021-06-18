const Alpaca = artifacts.require("AlpacaToken");
const Locker = artifacts.require("Locker");

module.exports = async function (deployer) {

    deployer.deploy(Alpaca, "Alpaca Token", "ALP");
    deployer.deploy(Locker);
};
