// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {IPRegistry} from "../src/IPRegistry.sol";

/// @notice Deploy with:
///   forge script script/Deploy.s.sol:Deploy \
///     --rpc-url $SEPOLIA_RPC --private-key $PRIVATE_KEY --broadcast
contract Deploy is Script {
    function run() external returns (IPRegistry registry) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);
        registry = new IPRegistry(deployer);
        vm.stopBroadcast();

        console.log("IPRegistry deployed at:", address(registry));
        console.log("Admin / initial LICENSER:", deployer);
    }
}
