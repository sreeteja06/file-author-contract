/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Saturday, 24th August 2019 5:27:09 pm
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
import { Button, Loader, Icon, Table } from "semantic-ui-react";
import fileAuthorContract from "../../contractHelper/fileAuthor";
import web3 from "../../contractHelper/web3";

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'

class UserFileList extends Component{
    accounts = [];
    table = [];
    files = [];
    state = {
        showFiles: false,
        loading: null
    }
    fetchAccounts = async () => {
        try {
            this.accounts = await web3.eth.getAccounts();
        } catch ( e ) {
            console.log( "cannot get accounts" );
        }
    };

    getFiles = async () => {
        this.setState( {
            showFiles: false,
            loading: "Hold your horses, Fetching User Files."
        })
        await this.fetchAccounts();
        let nFiles = await this.getNumberOfUserFiles();
        for( let i = 0; i < nFiles ; i++){
            this.files.push(await this.getUserFile(i));
        }
        this.table = [];
        for(let j = 0; j < this.files.length ; j++){
            let hrefValue = `https://gateway.ipfs.io/ipfs/${ this.files[j].hash}`
            let signHref = `/digdocsign?fileHash=${this.files[j].hash}`
            let date = this.props.dateFormatter(new Date(this.files[j].timeStamp * 1000))
            //http://localhost:3000/digdocsign?fileHash=QmPmtUizVmtYXauQEPZATAjo76tvPeAnaAxYFejcE63374
            this.table.push(
                <Table.Row>
                    <Table.Cell collapsing>
                        <Icon name='file' /> 
                    </Table.Cell>
                    <Table.Cell><a href = {hrefValue} >{this.files[j].hash}</a>    click</Table.Cell>
                    <Table.Cell>{date}</Table.Cell>
                    <Table.Cell><NavLink to={signHref}><Button color="blue">Sign Link</Button></NavLink></Table.Cell>
                </Table.Row>
            )
        }
        this.setState({
            showFiles: true,
            loading: null
        })
    }

    getNumberOfUserFiles = async () => {
        const flag = await fileAuthorContract.methods
            .getNumberOfUserFiles( )
            .call( {
                from: this.accounts[0]
            });
        console.log( "number of user files: "+flag );
        return flag;
    };

    getUserFile = async (index) => {
        const file = await fileAuthorContract.methods
            .getUserFile(index)
            .call({
                from: this.accounts[0]
            });
        return {
            hash: file.fileHash,
            timeStamp: file.timeStamp
        }
    }

    render() {
        return (
            <div>
                <Button color='teal' onClick={this.getFiles}>Show User Files List</Button>
                <Loader active={this.state.loading} inline="centered">
                    {this.state.loading}
                </Loader>
                {this.state.showFiles?
                    <Table celled striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan='3'><div style={{ "color": "#EE694C" }}>{this.accounts[0]}</div> ACCOUNT HOLDER Files</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                        {this.table}
                        </Table.Body>
                    </Table>
                    :null
                }
            </div>
        )
    }
}

export default UserFileList;