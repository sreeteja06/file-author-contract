/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Sunday, 25th August 2019 9:51:40 am
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
import React, { Component } from 'react';
import fileAuthorContract from '../../contractHelper/fileAuthor';
import web3 from '../../contractHelper/web3';
import FileUpload from '../FileUpload/FileUpload';
import UserFilesList from '../UserFilesList/UserFileList';
import { Loader, Message, Card } from 'semantic-ui-react';
import NavBar from '../navbar/Navbar';
import { protocols } from 'multiaddr';
let ipfsClient = require('ipfs-http-client');

class DigNotary extends Component {
  hash = '';
  accounts = [];
  state = {
    errMessage: null,
    owner: '',
    timeStamp: '',
    loading: null,
    showFileDetails: false
  };

  saveFile = file => {
    this.file = file;
  };
  //ipfs.infura.io protocol https
  generateFileHash = async () => {
    let host = 'localhost';
    host = 'ipfs.infura.io';
    let ipfs = ipfsClient({ host, port: '5001', protocol: 'https' });
    // let ipfs = ipfsClient({ port: '5001', host: 'ipfs', protocol: 'http' });
    this.fetchAccounts();
    const files = [
      {
        path: '/tmp/' + this.file.name,
        content: this.file
      }
    ];
    this.setState({
      loading: 'uploading file to ipfs'
    });
    let result = await ipfs.add(files);
    console.log(typeof result);
    console.log('result of ipfs file upload' + JSON.stringify(result));
    this.setState({ loading: null });
    this.hash = result[1].hash;
  };
  submit = async () => {
    this.setState({
      errMessage: null,
      owner: '',
      timeStamp: '',
      loading: null,
      showFileDetails: false
    });
    await this.generateFileHash();

    const flag = await this.checkForFile();
    console.log('Check for life returned:' + flag);
    if (!flag) {
      await this.addFileToContract();
    } else {
      console.log(`the file is already in the contract
      `);
      this.setState({
        errMessage: (
          <Message warning>
            <Message.Header>
              the file is already in the contract at{' '}
            </Message.Header>
          </Message>
        )
      });
      await this.fileDetails();
    }
  };

  checkForFile = async () => {
    console.log('check for file called');
    const flag = await fileAuthorContract.methods
      .checkForFile(this.hash)
      .call();
    console.log(flag);
    return flag;
  };

  fetchAccounts = async () => {
    try {
      this.accounts = await web3.eth.getAccounts();
      await window['ethereum'].enable();
    } catch (e) {
      console.log('cannot get accounts');
    }
  };

  addFileToContract = async () => {
    console.log('AddFileToContractCalled');
    this.setState({ loading: 'waiting for transaction to be completed' });
    try {
      const flag = await fileAuthorContract.methods.addFile(this.hash).call({
        from: this.accounts[0]
      });
      console.log('call executed' + flag);
      const reciept = await fileAuthorContract.methods.addFile(this.hash).send({
        from: this.accounts[0]
      });
      console.log('send the transaction: ' + reciept);
      if (flag) {
        console.log('the file is saved into the contract');
        this.setState({ message1: 'the file is saved into the contract' });
      }
    } catch (e) {
      for (let key in e.results) {
        //checks for revert condition
        if (e.results[key]['reason'] !== undefined) {
          if (
            e.results[key]['reason'] === 'checks if the file already exists'
          ) {
            console.log('the file already exists');
          }
        }
      }
    }
    console.log('Done Adding file to the contract');
    this.setState({ loading: null });
  };

  fileDetails = async () => {
    const FileDetails = await fileAuthorContract.methods
      .getFileDetails(this.hash)
      .call();
    console.log('Owner:' + FileDetails.owner);
    console.log('timeStamp:' + FileDetails.timeStamp);
    const date = new Date(FileDetails.timeStamp * 1000);
    const formatedDate = this.GetFormattedDate(date);
    this.setState({
      showFileDetails: true,
      address: `https://gateway.ipfs.io/ipfs/${this.hash}`,
      owner: 'Owner: ' + FileDetails.owner,
      timeStamp: 'timeStamp:' + formatedDate
    });
  };

  GetFormattedDate = date => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();
    return day + '/' + monthNames[month] + '/' + year;
  };

  render() {
    return (
      <div>
        <NavBar navItem='notary' />
        <h2>Digital Notary</h2>
        <br />
        <div style={{ marginTop: '100px' }}>
          <FileUpload
            change={e => this.saveFile(e.target.files[0])}
            click={this.submit}
          />
        </div>
        <div>
          {this.state.errMessage}
          <Loader active={this.state.loading} inline='centered'>
            {this.state.loading}
          </Loader>
          {this.state.showFileDetails ? (
            <Card fluid>
              <Card.Content header='About File' />
              <Card.Content description={this.state.owner} />
              <Card.Content extra>{this.state.timeStamp}</Card.Content>
              <a href={this.state.address}>check the file</a>
            </Card>
          ) : null}
        </div>
        <div style={{ marginTop: '150px', marginBottom: '130px' }}>
          <UserFilesList dateFormatter={this.GetFormattedDate} />
        </div>
      </div>
    );
  }
}

export default DigNotary;
