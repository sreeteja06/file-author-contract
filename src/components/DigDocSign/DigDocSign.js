/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Sunday, 25th August 2019 10:08:29 am
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
import React, { Component } from 'react';
import fileAuthorContract from "../../contractHelper/fileAuthor";
import web3 from "../../contractHelper/web3";
import NavBar from '../navbar/Navbar';
import querystring from 'querystring';
import { Input, Button, Loader, Card, Table } from 'semantic-ui-react';


class DigDocSign extends Component {

   accounts = [];
   tempFileHash = null;
   table = [];

   state = {
      owner: "",
      timeStamp: "",
      loading: null,
      showFileDetails: false,
      fileHash: null,
      showSignatures: false,
      signatures: [],
      signatureTimeStamps: []
   }

   DisplaySign = ( props ) => {
      return (
         <Table celled striped>
            <Table.Header>
               <Table.Row>
                  <Table.HeaderCell colSpan='3'>Document Signed By</Table.HeaderCell>
               </Table.Row>
            </Table.Header>
            <Table.Body>
               {this.table}
            </Table.Body>
         </Table>
      )
   }

   fetchAccounts = async () => {
      try {
         this.accounts = await web3.eth.getAccounts();
      } catch ( e ) {
         console.log( "cannot get accounts" );
      }
   };

   checkForFile = async () => {
      console.log( "check for file called" );
      const flag = await fileAuthorContract.methods
         .checkForFile( this.state.fileHash )
         .call();
      return flag;
   };

   fileDetails = async () => {
      const FileDetails = await fileAuthorContract.methods
         .getFileDetails( this.state.fileHash )
         .call();
      console.log( "Owner:" + FileDetails.owner );
      console.log( "timeStamp:" + FileDetails.timeStamp );
      const date = new Date( FileDetails.timeStamp * 1000 );
      const formatedDate = this.GetFormattedDate( date );
      this.setState( {
         showFileDetails: true,
         address: `https://gateway.ipfs.io/ipfs/${ this.state.fileHash }`,
         owner: FileDetails.owner,
         timeStamp: "timeStamp:" + formatedDate
      } );
   };

   getSignatureDetails = async () => {
      console.log("fetching signature details....");
      let signs = await fileAuthorContract.methods
         .getSignatures( this.state.fileHash )
         .call();
      console.log("signatures");
      console.log( signs );
      let signTimes = await fileAuthorContract.methods
         .getSignatureTimeStamps( this.state.fileHash )
         .call();
      console.log( "signature Timestamps" );
      console.log( signTimes );
      this.table = [];
      for ( let j = 0; j < signs.length; j++ ) {
         let date = this.GetFormattedDate( new Date( signTimes[j] * 1000 ) )
         //http://localhost:3000/digdocsign?fileHash=QmPmtUizVmtYXauQEPZATAjo76tvPeAnaAxYFejcE63374
         this.table.push(
            <Table.Row>
               <Table.Cell>{signs[j]}</Table.Cell>
               <Table.Cell>{date}</Table.Cell>
            </Table.Row>
         )
      }
      this.setState({
         showSignatures: true
      })
   }

   signDocument = async () => {
      console.log("signing the document");
      this.setState( { loading: "waiting for transaction to be completed" } );
      try{
         const flag = await fileAuthorContract.methods.signDocument( this.state.fileHash ).call( {
            from: this.accounts[0]
         } );
         console.log( "call executed" + flag );
         const reciept = await fileAuthorContract.methods.signDocument( this.state.fileHash ).send( {
            from: this.accounts[0]
         } );
         console.log( "send the transaction: " + reciept );
         if ( flag ) {
            console.log( "Document Signed" );
            this.setState( { message1: "Document Signed" } );
         }
      }catch(e){
         console.log("error");
         console.log(e);
      }
      this.setState( { loading: null } );
   }

   handleSubmit = e => {
      this.tempFileHash = e;
   };

   findButton = async() => {
      await this.setState({
         fileHash: this.tempFileHash
      })
      await this.initFileProperties();
   }

   initFileProperties = async() => {
      await this.fetchAccounts();
      let fileExists = await this.checkForFile();
      if ( !fileExists ) {
         console.log( "file hash does not exist" );
         return 0;
      } else {
         console.log( "file exists" );
         this.fileDetails();
      }
   }

   async componentDidMount(){
      let qString = this.props.location.search.substring(1);
      let queryObj = querystring.parse( qString );
      console.log(queryObj);
      if(queryObj.fileHash){
         console.log("file hash from query")
         await this.setState({
            fileHash: queryObj.fileHash
         })
         await this.initFileProperties();
      }
   }

   render() {
      return (
         <div>
         <div>
            <NavBar navItem="digdocsign"></NavBar>
            <h2> Dig Doc Sign</h2>
            <br/>
            <Input 
            type="text"
            onChange={e => this.handleSubmit( e.target.value )} 
            size="big"
            labelPosition='right'
            placeholder='Enter File Hash...'
            />
               <Button content='Find' size="big" primary onClick={this.findButton} /><br /><br />
            File Hash:<br/><b><i>{this.state.fileHash}</i></b><br/>
            </div><br />
            <div>
               <Loader active={this.state.loading} inline="centered">
                  {this.state.loading}
               </Loader>
               {this.state.showFileDetails ?
                  <div><Card fluid>
                     <Card.Content header="About File" />
                     <Card.Content description={this.state.owner} />
                     <Card.Content extra>{this.state.timeStamp}</Card.Content>
                  </Card> 
                     <br/>
                     <a href={this.state.address}><Button positive>check the document</Button></a>
                     <Button color="orange" onClick={this.getSignatureDetails}>check Signatures</Button>
                     <br /><br />
                     {this.state.showSignatures ? 
                     <this.DisplaySign/>: null}
                     <br /><br />
                     <Button color="purple" onClick={this.signDocument}>Sign the document</Button>
                     </div> : null}
            </div>
         </div>
      )
   }

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
}

export default DigDocSign;