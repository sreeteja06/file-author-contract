import web3 from "./web3";
import { abi } from "./fileAuthor.json";
const instance = new web3.eth.Contract(
  abi,
  "0xfa3865F1faAB581DE32db82AbA86C698c4bdCF34"
);

export default instance;