// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {IPRegistry} from "../src/IPRegistry.sol";

contract IPRegistryTest is Test {
    IPRegistry registry;

    address admin = address(0xA11CE);
    address creator = address(0xB0B);
    address agent = address(0xC0FFEE);
    address stranger = address(0xDEAD);

    string constant CID = "bafybeigdyrztest123examplecid";
    uint256 constant PRICE = 1 ether;
    uint256 constant WINDOW = 1 days;

    function setUp() public {
        registry = new IPRegistry(admin);
        bytes32 licenserRole = registry.LICENSER_ROLE();

        // Admin grants a vetted creator the LICENSER_ROLE.
        vm.prank(admin);
        registry.grantRole(licenserRole, creator);

        vm.deal(agent, 10 ether);
        vm.deal(stranger, 10 ether);
    }

    function test_MintSetsCorrectState() public {
        vm.prank(creator);
        uint256 assetId = registry.mintIP(CID, PRICE, WINDOW);

        assertEq(registry.ownerOf(assetId), creator);
        assertEq(registry.cidOf(assetId), CID);
        assertEq(registry.priceOf(assetId), PRICE);
        assertEq(registry.accessWindowOf(assetId), WINDOW);
        assertEq(registry.creatorOf(assetId), creator);
    }

    function test_RevertWhen_NonLicenserMints() public {
        vm.prank(stranger);
        vm.expectRevert();
        registry.mintIP(CID, PRICE, WINDOW);
    }

    function test_RevertWhen_InsufficientPayment() public {
        vm.prank(creator);
        uint256 assetId = registry.mintIP(CID, PRICE, WINDOW);

        vm.prank(agent);
        vm.expectRevert(abi.encodeWithSelector(IPRegistry.InsufficientPayment.selector, PRICE, PRICE - 1));
        registry.requestAccess{value: PRICE - 1}(assetId);
    }

    function test_AccessGrantedAfterPayment() public {
        vm.prank(creator);
        uint256 assetId = registry.mintIP(CID, PRICE, WINDOW);

        assertFalse(registry.hasActiveAccess(assetId, agent));

        vm.prank(agent);
        registry.requestAccess{value: PRICE}(assetId);

        assertTrue(registry.hasActiveAccess(assetId, agent));
    }

    function test_AccessExpires() public {
        vm.prank(creator);
        uint256 assetId = registry.mintIP(CID, PRICE, WINDOW);

        vm.prank(agent);
        registry.requestAccess{value: PRICE}(assetId);
        assertTrue(registry.hasActiveAccess(assetId, agent));

        vm.warp(block.timestamp + WINDOW + 1);
        assertFalse(registry.hasActiveAccess(assetId, agent));
    }

    function test_CreatorCanRevokeEarly() public {
        vm.prank(creator);
        uint256 assetId = registry.mintIP(CID, PRICE, WINDOW);

        vm.prank(agent);
        registry.requestAccess{value: PRICE}(assetId);
        assertTrue(registry.hasActiveAccess(assetId, agent));

        vm.prank(creator);
        registry.revokeAccess(assetId, agent);
        assertFalse(registry.hasActiveAccess(assetId, agent));
    }

    function test_RevertWhen_StrangerRevokesAccess() public {
        vm.prank(creator);
        uint256 assetId = registry.mintIP(CID, PRICE, WINDOW);

        vm.prank(stranger);
        vm.expectRevert(IPRegistry.NotAssetCreator.selector);
        registry.revokeAccess(assetId, agent);
    }

    function test_CreatorCanWithdrawPayments() public {
        vm.prank(creator);
        uint256 assetId = registry.mintIP(CID, PRICE, WINDOW);

        vm.prank(agent);
        registry.requestAccess{value: PRICE}(assetId);

        uint256 balBefore = creator.balance;
        vm.prank(creator);
        registry.withdraw();
        assertEq(creator.balance, balBefore + PRICE);
    }

    function test_RevertWhen_NothingToWithdraw() public {
        vm.prank(stranger);
        vm.expectRevert(IPRegistry.NothingToWithdraw.selector);
        registry.withdraw();
    }

    function test_RevertWhen_ActionOnNonexistentAsset() public {
        vm.expectRevert(IPRegistry.AssetDoesNotExist.selector);
        registry.setPrice(999, 1 ether);
    }
    function test_AccessTimeStacksOnRenewal() public {
        vm.prank(creator);
        uint256 assetId = registry.mintIP(CID, PRICE, WINDOW);

        // Agent buys first window
        vm.prank(agent);
        registry.requestAccess{value: PRICE}(assetId);
        
        // Fast forward exactly half a day
        vm.warp(block.timestamp + (WINDOW / 2)); 
        
        // Agent buys a second window before the first expires
        vm.prank(agent);
        registry.requestAccess{value: PRICE}(assetId);

        // Expiry should be the current time + 1.5 days total remaining
        uint256 expectedExpiry = block.timestamp + (WINDOW / 2) + WINDOW;
        
        // We can't directly read the private mapping without an explicit getter, 
        // but we can warp to 1 second before expected expiry and check it's true, 
        // then warp to 1 second after and check it's false.
        vm.warp(expectedExpiry - 1);
        assertTrue(registry.hasActiveAccess(assetId, agent), "Should be active just before expiry");

        vm.warp(expectedExpiry + 1);
        assertFalse(registry.hasActiveAccess(assetId, agent), "Should be expired just after expiry");
    }
    function test_OverpaymentIsRefunded() public {
        vm.prank(creator);
        uint256 assetId = registry.mintIP(CID, PRICE, WINDOW);

        uint256 initialAgentBalance = agent.balance; // 10 ether
        uint256 overpayment = PRICE + 2 ether;       // Sending 3 ether

        vm.prank(agent);
        registry.requestAccess{value: overpayment}(assetId);

        // Agent should only be charged PRICE (1 ether), the 2 ether is refunded
        assertEq(agent.balance, initialAgentBalance - PRICE, "Agent was not refunded correctly");

        // Creator should only be owed PRICE (1 ether)
        uint256 creatorBalBefore = creator.balance;
        vm.prank(creator);
        registry.withdraw();
        assertEq(creator.balance, creatorBalBefore + PRICE, "Creator received more than the asset price");
    }
    function test_TokenURIReturnsCorrectIPFSFormat() public {
        vm.prank(creator);
        uint256 assetId = registry.mintIP(CID, PRICE, WINDOW);

        string memory expectedURI = string(abi.encodePacked("ipfs://", CID));
        assertEq(registry.tokenURI(assetId), expectedURI, "tokenURI did not format IPFS link correctly");
    }
}
