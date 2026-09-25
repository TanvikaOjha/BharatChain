// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract IPRegistry is ERC721, AccessControl, ReentrancyGuard {
    bytes32 public constant LICENSER_ROLE = keccak256("LICENSER_ROLE");

    bytes32 public constant CONSUMER_ROLE = keccak256("CONSUMER_ROLE");

    uint256 private _nextAssetId = 1;

    mapping(uint256 => string) public cidOf;

    mapping(uint256 => uint256) public priceOf;

    mapping(uint256 => uint256) public accessWindowOf;

    mapping(uint256 => address) public creatorOf;

    mapping(uint256 => mapping(address => uint256)) public consumerExpiry;

    mapping(address => uint256) public pendingWithdrawals;

    event IPMinted(uint256 indexed assetId, address indexed creator, string cid, uint256 price, uint256 accessWindow);
    event PriceUpdated(uint256 indexed assetId, uint256 newPrice);
    event AccessWindowUpdated(uint256 indexed assetId, uint256 newWindow);
    event AccessGranted(uint256 indexed assetId, address indexed consumer, uint256 expiresAt);
    event AccessRevoked(uint256 indexed assetId, address indexed consumer);
    event Withdrawn(address indexed creator, uint256 amount);

    error NotAssetCreator();
    error InsufficientPayment(uint256 required, uint256 sent);
    error AssetDoesNotExist();
    error NothingToWithdraw();
    error WithdrawFailed();

    modifier onlyAssetCreator(uint256 assetId) {
        if (creatorOf[assetId] != msg.sender) revert NotAssetCreator();
        _;
    }

    modifier assetExists(uint256 assetId) {
        if (creatorOf[assetId] == address(0)) revert AssetDoesNotExist();
        _;
    }

    constructor(address admin) ERC721("IPRegistry", "IPNFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(LICENSER_ROLE, admin);
    }

    function mintIP(string calldata cid, uint256 price, uint256 accessWindowSeconds)
        external
        onlyRole(LICENSER_ROLE)
        returns (uint256 assetId)
    {
        assetId = _nextAssetId++;
        creatorOf[assetId] = msg.sender;
        cidOf[assetId] = cid;
        priceOf[assetId] = price;
        accessWindowOf[assetId] = accessWindowSeconds;

        _safeMint(msg.sender, assetId);

        emit IPMinted(assetId, msg.sender, cid, price, accessWindowSeconds);
    }

    function setPrice(uint256 assetId, uint256 newPrice) external assetExists(assetId) onlyAssetCreator(assetId) {
        priceOf[assetId] = newPrice;
        emit PriceUpdated(assetId, newPrice);
    }

    function setAccessWindow(uint256 assetId, uint256 newWindowSeconds)
        external
        assetExists(assetId)
        onlyAssetCreator(assetId)
    {
        accessWindowOf[assetId] = newWindowSeconds;
        emit AccessWindowUpdated(assetId, newWindowSeconds);
    }

    function requestAccess(uint256 assetId) external payable nonReentrant assetExists(assetId) {
        uint256 price = priceOf[assetId];
        if (msg.value < price) revert InsufficientPayment(price, msg.value);

        pendingWithdrawals[creatorOf[assetId]] += msg.value;

        uint256 expiresAt = block.timestamp + accessWindowOf[assetId];
        consumerExpiry[assetId][msg.sender] = expiresAt;

        emit AccessGranted(assetId, msg.sender, expiresAt);
    }

    function revokeAccess(uint256 assetId, address consumer) external assetExists(assetId) onlyAssetCreator(assetId) {
        consumerExpiry[assetId][consumer] = 0;
        emit AccessRevoked(assetId, consumer);
    }

    function hasActiveAccess(uint256 assetId, address agent) public view returns (bool) {
        return consumerExpiry[assetId][agent] > block.timestamp;
    }

    function withdraw() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        if (amount == 0) revert NothingToWithdraw();

        pendingWithdrawals[msg.sender] = 0;
        (bool ok, ) = msg.sender.call{value: amount}("");
        if (!ok) revert WithdrawFailed();

        emit Withdrawn(msg.sender, amount);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
