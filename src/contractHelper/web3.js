import Web3 from 'web3';
let web3

if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
    web3 = new Web3(Web3.givenProvider);
}
else{
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/ec2f8b79db3b4da587c4c5299162f65c'
    );
    web3 = new Web3(provider);
}

export default web3;