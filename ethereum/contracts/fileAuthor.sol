pragma solidity ^0.5.0;

contract fileAuthor{
    struct FileProperties{
        uint timeStamp;
        address owner;
        bool flag;
    }
    mapping (string=>FileProperties) savedFilesProperties;
    mapping (address=>string[]) userFiles;
    function checkForFile(string memory fileHash) public view returns (bool){
        return savedFilesProperties[fileHash].flag;
    }
    function addFile(string memory fileHash) public returns (bool){
        require(!savedFilesProperties[fileHash].flag,"checks if the file already exists");
        savedFilesProperties[fileHash].flag = true;
        savedFilesProperties[fileHash].owner = msg.sender;
        savedFilesProperties[fileHash].timeStamp = now;
        userFiles[msg.sender].push(fileHash);
        return true;
    }
    function getFileDetails(string memory fileHash) public view returns (address owner, uint timeStamp){
        require(savedFilesProperties[fileHash].flag,"checks if the file exists");
        owner = savedFilesProperties[fileHash].owner;
        timeStamp = savedFilesProperties[fileHash].timeStamp;
    }
    function getNumberOfUserFiles() public view returns (uint){
        return userFiles[msg.sender].length;
    }
    function getUserFile(uint index) public view returns (string memory fileHash, uint timeStamp){
        require(index < userFiles[msg.sender].length, "array index out of bound");
        fileHash = userFiles[msg.sender][index];
        timeStamp = savedFilesProperties[fileHash].timeStamp;
    }
}