const Web3 = require("web3");
const web3 = new Web3("http://localhost:7545");
const fs = require('fs');

fs.readFile('./build/contracts/Storage.json', 'utf8' , async (err, data) => {
    console.log(typeof data)
    const storage = new web3.eth.Contract(
      JSON.parse(data).abi,
      "0x3bD4FF9f5399832FDA164dE94A827b1A15a932C4"
    );
    await storage.methods.store(124).send({ from: "0xDeeACC21de565d8f17E33746eb9Ca1286ea61C6a", gas: 400000 });
    console.log(await storage.methods.retrieve.call())
})
