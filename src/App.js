import React, { Component } from "react";
import "./App.css";
import sha256 from "sha256";
import fileAuthorContract from "./contractHelper/fileAuthor";
import web3 from "./contractHelper/web3";
import FileUpload from "./components/FileUpload/FileUpload";
import { Loader, Message, Card } from "semantic-ui-react";
import privateKey from './contractHelper/private'

class App extends Component {
  hash = "";
  accounts = [];
  state = {
    errMessage: null,
    owner: "",
    timeStamp: "",
    loading: null,
    showFileDetails: false
  };

  generateFileHash = file => {
    this.fetchAccounts();
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
    this.setState({
      errMessage: null,
      owner: "",
      timeStamp: "",
      loading: null,
      showFileDetails: false
    });

    const flag = await this.checkForFile();
    console.log("Check for life returned:" + flag);
    if (!flag) {
      await this.addFileToContract();
    } else {
      console.log("the file is already in the contract");
      this.setState({
        errMessage: (
          <Message warning>
            <Message.Header>the file is already in the contract</Message.Header>
          </Message>
        )
      });
      await this.fileDetails();
    }
  };

  checkForFile = async () => {
    console.log("check for file called");
    const flag = await fileAuthorContract.methods
      .checkForFile(this.hash)
      .call();
    console.log(flag);
    return flag;
  };

  fetchAccounts = async () => {
    try {
      this.accounts = await web3.eth.getAccounts();
      this.accounts = await web3.eth.accounts.privateKeyToAccount( privateKey );
      // this.accounts = await web3.eth.accounts.create();
      this.accounts = this.accounts
      console.log("accounts: "+ this.accounts);
    } catch (e) {
      console.log("cannot get accounts");
    }
  };

  addFileToContract = async () => {
    console.log("AddFileToContractCalled");
    this.setState({ loading: "waiting for transaction to be completed" });
    try {
      const tx_builder = await fileAuthorContract.methods.addFile( this.hash );
      const encoded_tx = tx_builder.encodeABI();
      let transactionObject = {
        gas: 6000000,
        data: encoded_tx,
        from: this.accounts.address,
        to: "0xfa3865F1faAB581DE32db82AbA86C698c4bdCF34"
      };
      let signedTransaction = await web3.eth.accounts.signTransaction( transactionObject, this.accounts.privateKey, async function ( error, signedTx ) {
        if ( error ) {
          console.log( error );
          // handle error
        }
      })
      await web3.eth.sendSignedTransaction( signedTransaction.rawTransaction )
        .on( 'receipt', function ( receipt ) {
          //do something
        } );
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
    this.setState({ loading: null });
  };

  fileDetails = async () => {
    const FileDetails = await fileAuthorContract.methods
      .getFileDetails(this.hash)
      .call();
    console.log("Owner:" + FileDetails.owner);
    console.log("timeStamp:" + FileDetails.timeStamp);
    const date = new Date(FileDetails.timeStamp * 1000);
    const formatedDate = this.GetFormattedDate(date);
    this.setState({
      showFileDetails: true,
      owner: "Owner: " + FileDetails.owner,
      timeStamp: "timeStamp:" + formatedDate
    });
  };

  GetFormattedDate = date => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();
    return day + "/" + monthNames[month] + "/" + year;
  };

  render() {
    return (
      <div className="App">
        <h2>FILE-AUTHOR</h2>
        <br />
        <FileUpload
          change={e => this.generateFileHash(e.target.files[0])}
          click={this.submit}
        />
        <div>
          {this.state.errMessage}
          <Loader active={this.state.loading} inline="centered">
            {this.state.loading}
          </Loader>
            {this.state.showFileDetails?
            <Card fluid>
              <Card.Content header="About File" />
              <Card.Content description={this.state.owner} />
              <Card.Content extra>{this.state.timeStamp}</Card.Content>
            </Card>:null}
          </div>
        </div>
    );
  }
}

export default App;
