const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const fileAuthorJSON = require("../ethereum/build/fileAuthor.json");

let accounts;
var fileAuthorContract;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  try {
    fileAuthorContract = await new web3.eth.Contract(fileAuthorJSON.abi)
      .deploy({ data: "0x" + fileAuthorJSON["evm"]["bytecode"]["object"] })
      .send({ gas: 2000000, from: accounts[0] });
  } catch (e) {
    console.error(e);
  }
});

describe("fileAuthorContract", () => {
  it("deploys the contract", async () => {
    assert.ok(fileAuthorContract.options.address);
    console.log(fileAuthorContract.options.address);
  });
  it("it returns false when no file exists", async () => {
    const flag = await fileAuthorContract.methods.checkForFile("hello").call();
    assert.equal(flag, false);
  });
  it("it tests the add file method and also if the file saved into the contract and doesnt allow one more", async () => {
    const flag = await fileAuthorContract.methods.addFile("abcd").call({
      gas: 450000,
      from: accounts[0]
    });
    const reciept = await fileAuthorContract.methods.addFile("abcd").send({
      gas: 450000,
      from: accounts[0]
    });
    assert.equal(flag, true, "the file is not saved");
    const flag2 = await fileAuthorContract.methods.checkForFile("abcd").call();
    assert.equal(flag2, true, "the file doesnt exist in the contract");
    let flag3;
    try {
       flag3 = await fileAuthorContract.methods.addFile("abcd").call({
        gas: 450000,
        from: accounts[0]
      });

      reciept = await fileAuthorContract.methods.addFile("abcd").send({
        gas: 450000,
        from: accounts[0]
      });
    } catch (e) {
      assert(e);
      for( let key in e.results){                      //checks for revert condition
          if(e.results[key]["reason"]!=undefined){
              assert.equal(e.results[key]["reason"], "checks if the file already exists", "check if it reverts with the correct reason");
          }
      }
    }
  });
  it("tests weather it gives the correct owner is returned", async () =>{
    const flag = await fileAuthorContract.methods.addFile("abcd").call({
        gas: 450000,
        from: accounts[0]
      });
      const reciept = await fileAuthorContract.methods.addFile("abcd").send({
        gas: 450000,
        from: accounts[0]
      });
      assert.equal(flag, true, "the file is not saved");
      const owner = await fileAuthorContract.methods.getOwner("abcd").call();
      assert.equal(owner, accounts[0], "did not return the right owner");

  })
});
