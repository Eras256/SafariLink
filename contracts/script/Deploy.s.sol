// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PrizeDistributor.sol";
import "../src/NFTCertificate.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PrizeDistributor
        PrizeDistributor distributor = new PrizeDistributor();
        console.log("PrizeDistributor deployed at:", address(distributor));

        // Deploy NFTCertificate
        NFTCertificate nft = new NFTCertificate("https://api.safarilink.xyz/metadata/");
        console.log("NFTCertificate deployed at:", address(nft));

        vm.stopBroadcast();
    }
}

