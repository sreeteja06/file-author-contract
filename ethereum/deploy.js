const HDwalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./build/fileAuthor.json");
const { seed } = require("./seed");

const bytecode = evm.bytecode;

const provider = new HDwalletProvider(
  seed,
  "https://rinkeby.infura.io/v3/ec2f8b79db3b4da587c4c5299162f65c"
);
const web3 = new Web3(provider);
const interface = JSON.stringify(abi);
let accounts, result;

const deploy = async () => {
  try {
    accounts = await web3.eth.getAccounts();
    console.log(accounts);
  } catch (e) {
    console.log("Error getting accounts " + e);
  }
  try {
    result = await new web3.eth
      .Contract(JSON.parse(interface))
      .deploy({ data: "0x" + bytecode.object })
      .send({ gas: "2000000", from: accounts[0] });
    console.log("Contract deployed to: " + result.options.address);             //0xfa3865F1faAB581DE32db82AbA86C698c4bdCF34
  } catch (e) {
    console.log("error deploying contract " + e);
  }
};

deploy();
