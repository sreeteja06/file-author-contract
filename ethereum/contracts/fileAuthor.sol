pragma solidity ^0.5.0;

contract fileAuthor{
    mapping (string=>uint) fileTimeStamp;
    mapping (string=>address) fileOwner;
    mapping (address=>uint) number_of_files_owner_owns;
    function checkForFile(string memory fileHash) public view returns (bool){
        if(fileOwner[fileHash]==address(0x0)){
            return false;
        }
        else{
            return true;
        }
    }
    function addFile(string memory fileHash) public returns (bool){
        require((address(0x0)==fileOwner[fileHash]),"checks if the file already exists");
        fileOwner[fileHash] = msg.sender;
        fileTimeStamp[fileHash] = now;
        return true;
    }
    function getOwner(string memory fileHash) public view returns (address){
        require((address(0x0)!=fileOwner[fileHash]),"checks if the file exists");
        return fileOwner[fileHash];
    }
    function getFileTimeStamp(string memory fileHash) public view returns (uint){
        require((address(0x0)!=fileOwner[fileHash]),"checks if the file exists");
        return fileTimeStamp[fileHash];
    }
}