import React, { Component } from "react";
import "./App.css";
import { Button, Input } from "semantic-ui-react";
import sha256 from "sha256";
import fileAuthorContract from "./contractHelper/fileAuthor";
import web3 from './contractHelper/web3'

class App extends Component {
  hash = "";
  state = {
    buttonPressed: false
  };

  generateFileHash = file => {
    if (file !== undefined) {
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        let reader = new FileReader();
        reader.onload = event => {
          this.hash = sha256(event.target.result);
          console.log("hash : " + this.hash);
        };
        reader.readAsText(file);
      } else {
        alert("The File APIs are not fully supported in this browser.");
      }
    }
  };
  submit = async () => {
    if (this.state.buttonPressed) {
      this.setState({ buttonPressed: false });
    }
    const flag = await this.checkForFile();
    console.log("Check for life returned:" + flag);
    if (!flag) {
      await this.addFileToContract();
    } else{
      console.log("the file is already in the contract");
      await this.fileDetails();
    }
  };

  checkForFile = async () => {
    console.log("check for file called");
    const flag = await fileAuthorContract.methods.checkForFile(this.hash).call();
    console.log(flag);
    return flag;
  };

  addFileToContract = async () => {
    let accounts = [];
    
    try{
      accounts = await web3.eth.getAccounts();
    }catch(e){
      console.log("cannot get accounts");
    }
    console.log("AddFileToContractCalled");
    try {
      const flag = await fileAuthorContract.methods.addFile(this.hash).call({
        from: accounts[0]
      });
      console.log("call executed"+flag);
      const reciept = await fileAuthorContract.methods.addFile(this.hash).send({
        from: accounts[0]
      });
      console.log("send the transaction: " + reciept);
      if (flag) {
        console.log("the file is saved into the contract");
      }
    } catch (e) {
      for (let key in e.results) {
        //checks for revert condition
        if (e.results[key]["reason"] !== undefined) {
          if (
            e.results[key]["reason"] === "checks if the file already exists"
          ) {
            console.log("the file already exists");
          }
        }
      }
    }
    console.log("Done Adding file to the contract");
  };

  fileDetails = async () => {
    const FileDetails = await fileAuthorContract.methods.getFileDetails(this.hash).call();
    console.log("Owner:"+FileDetails.owner);
    console.log("timeStamp:"+FileDetails.timeStamp);

  }

  render() {
    return (
      <div className="App">
        <h1>Hello World from FILE-AUTHOR</h1>
        <Input
          type="file"
          onChange={e => {
            this.generateFileHash(e.target.files[0]);
          }}
          placeholder="Upload file"
        />
        <Button primary onClick={this.submit}>
          Upload
        </Button>
      </div>
    );
  }
}

export default App;
