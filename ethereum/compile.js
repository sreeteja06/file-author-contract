const solc = require('solc');
const fs = require('fs-extra');
const path = require('path');

const buildPath = path.resolve(__dirname,'build');
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname,'contracts','fileAuthor.sol');

const source = fs.readFileSync(contractPath,'utf-8');

const input = {
    language: "Solidity",
    sources:{
        "fileAuthor":{
            content: source
        }
    },
    settings:{
        outputSelection: {
            "*": {
                "*": [ "*" ]
            }
        }
    }
};

let output = JSON.stringify(JSON.parse(solc.compile(JSON.stringify(input))),null,2);
output = JSON.parse(output);
// fs.writeFileSync("temp.json",output);

fs.ensureDir(buildPath);
for( let contract in output.contracts["fileAuthor"]){
    fs.outputJSONSync(
        path.resolve(buildPath, contract+'.json'),
        output.contracts["fileAuthor"][contract]
    );
}