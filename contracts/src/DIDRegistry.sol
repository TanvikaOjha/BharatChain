// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";


contract DIDRegistry {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    struct DIDDocument {
        address owner;
        string docURI;     
        uint256 createdAt;
        uint256 updatedAt;
        bool revoked;
    }

   
    mapping(bytes32 => DIDDocument) private documents;

    event DIDRegistered(bytes32 indexed didHash, address indexed owner, string docURI);
    event DIDUpdated(bytes32 indexed didHash, string newDocURI);
    event DIDRevoked(bytes32 indexed didHash);
    event DIDOwnershipTransferred(bytes32 indexed didHash, address indexed oldOwner, address indexed newOwner);

    error DIDAlreadyRegistered(bytes32 didHash);
    error DIDNotFound(bytes32 didHash);
    error NotDIDOwner(bytes32 didHash, address caller);
    error DIDIsRevoked(bytes32 didHash);
    error InvalidSignature();
    error ZeroAddress();

    modifier onlyDIDOwner(bytes32 didHash) {
        DIDDocument storage doc = documents[didHash];
        if (doc.owner == address(0)) revert DIDNotFound(didHash);
        if (doc.owner != msg.sender) revert NotDIDOwner(didHash, msg.sender);
        if (doc.revoked) revert DIDIsRevoked(didHash);
        _;
    }


    function registerDID(bytes32 didHash, string calldata docURI) external {
        if (documents[didHash].owner != address(0)) {
            revert DIDAlreadyRegistered(didHash);
        }

        documents[didHash] = DIDDocument({
            owner: msg.sender,
            docURI: docURI,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            revoked: false
        });

        emit DIDRegistered(didHash, msg.sender, docURI);
    }

    function updateDID(bytes32 didHash, string calldata newDocURI) external onlyDIDOwner(didHash) {
        DIDDocument storage doc = documents[didHash];
        doc.docURI = newDocURI;
        doc.updatedAt = block.timestamp;

        emit DIDUpdated(didHash, newDocURI);
    }


    function revokeDID(bytes32 didHash) external onlyDIDOwner(didHash) {
        documents[didHash].revoked = true;
        documents[didHash].updatedAt = block.timestamp;

        emit DIDRevoked(didHash);
    }


    function transferDIDOwnership(bytes32 didHash, address newOwner) external onlyDIDOwner(didHash) {
        if (newOwner == address(0)) revert ZeroAddress();

        address oldOwner = documents[didHash].owner;
        documents[didHash].owner = newOwner;
        documents[didHash].updatedAt = block.timestamp;

        emit DIDOwnershipTransferred(didHash, oldOwner, newOwner);
    }


    function resolveDID(bytes32 didHash) external view returns (DIDDocument memory) {
        DIDDocument memory doc = documents[didHash];
        if (doc.owner == address(0)) revert DIDNotFound(didHash);
        return doc;
    }

  
    function isActiveOwner(bytes32 didHash, address account) external view returns (bool) {
        DIDDocument memory doc = documents[didHash];
        return doc.owner == account && !doc.revoked && doc.owner != address(0);
    }


    function verifyOwnership(bytes32 didHash,bytes32 challenge,bytes calldata signature) external view returns (bool) 
    {
        DIDDocument memory doc = documents[didHash];
        if (doc.owner == address(0)) revert DIDNotFound(didHash);
        if (doc.revoked) revert DIDIsRevoked(didHash);

        bytes32 ethSignedHash = challenge.toEthSignedMessageHash();
        address recovered = ethSignedHash.recover(signature);

        if (recovered == address(0)) revert InvalidSignature();
        return recovered == doc.owner;
    }
}
