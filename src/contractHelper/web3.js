import Web3 from 'web3';
let web3;

let ethereum = window['ethereum'];
if (typeof window !== 'undefined' && typeof ethereum !== 'undefined') {
  web3 = new Web3(ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/ec2f8b79db3b4da587c4c5299162f65c'
  );
  web3 = new Web3(provider);
}

export default web3;
