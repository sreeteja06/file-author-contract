import web3 from "./web3";
import { abi } from "./fileAuthor.json";
const instance = new web3.eth.Contract(
  abi,
  "0x089aDEA31d9BfF4451cC3E9be347D890A98aF8bc"
);

export default instance;