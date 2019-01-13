pragma solidity ^0.5.0;

contract fileAuthor{
    struct FileProperties{
        uint timeStamp;
        address owner;
        bool flag;
    }
    mapping (string=>FileProperties) savedFilesProperties;
    mapping (address=>uint) number_of_files_owner_owns;
    
    function checkForFile(string memory fileHash) public view returns (bool){
        return savedFilesProperties[fileHash].flag;
    }
    
    function addFile(string memory fileHash) public returns (bool){
        require(!savedFilesProperties[fileHash].flag,"checks if the file already exists");
        savedFilesProperties[fileHash].flag = true;
        savedFilesProperties[fileHash].owner = msg.sender;
        savedFilesProperties[fileHash].timeStamp = now;
        number_of_files_owner_owns[msg.sender]++;
        return true;
    }
    function getFileDetails(string memory fileHash) public view returns (address owner, uint timeStamp){
        require(savedFilesProperties[fileHash].flag,"checks if the file exists");
        owner = savedFilesProperties[fileHash].owner;
        timeStamp = savedFilesProperties[fileHash].timeStamp;
    }
}