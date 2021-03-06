[Digital Notary Signature WebDemo](https://digitalnotary.herokuapp.com "https://digitalnotary.herokuapp.com")
###### Note: The Document upload and the document signatures won't work in the above link. If you wanna check those features also, run the application locally. You can find the details to how the run the application locally at the end of this readme.

## Digital Notary Flow Diagram
![Digital Notary Flow Diagram](https://github.com/sreeteja06/file-author-contract/blob/master/digNotaryDiag.png)

## Digital Document Signature Flow Diagram
![Digital Document Signature Flow Diagram](https://github.com/sreeteja06/file-author-contract/blob/master/digDocDiag.png)

## Digital Notary Page
![Digital Notary Page](https://github.com/sreeteja06/file-author-contract/blob/master/digNotaryWeb.png)

## Digital Document Signature Page
![Digital Document Signature Page](https://github.com/sreeteja06/file-author-contract/blob/master/digDocWeb.png)

File author smart contract is used to protect the file identity i.e publicly verify signatures on a digital document without the need for a trusted third party member.

Using the Ethereum blockchain, we can store a hash of a private document (a contract, for example) along with an Ethereum Address. This proves in a public and secure way that the owner of the Ethereum Address has signed the document. Other parties to the contract can sign it as well. All they need is a link to the signing page, which is generated when a user uploads a file.

The original document always generates the same hash. If there is ever a dispute over the details of the document, anybody who possesses the original digital document can generate the hash and show that people have signed it by searching the blockchain for that hash and the accompanying Addresses.

The hash is a cryptographic string that cannot be reverse-engineered. The hash can only be generated by providing the original digital document as a seed.

# How the application works 
- The user is asked to upload a file.
- The file is uploaded to ipfs and it returns the hash of the file which is a CID.
- This CID (hash) is stored in the ethereum smartcontract deployed in the rinkbey test network.
- The user on visiting the home page with metamask logged in to rinkeby network, shows a list of documents he has previously uploaded into the network, he also gets a link to docsign page, which can be shared with the fellow members who are required to sign the document.
- In docsign page, given the file hash we can check who signed the document, view the document and also if agreed to what document says to sign.
- When the same file is uploaded again by the other user, he is notfied that theres a specific file which genrates the same hash already in the network.
# Setup to run the application
> 1. Download metamask extenstion in your chrome browser. [metmask.io](https://metamask.io/)
> 2. Download IPFS, if you need fast and reliable file storage run your own node. [ipfs.io](https://docs.ipfs.io/guides/guides/install/)
> 3. Node and npm to run the react app. [node.org](https://nodejs.org/en/)
# Run the application
Clone the repository
```console
git clone https://github.com/sreeteja06/file-author-contract.git
cd file-author-contract
npm start
```
