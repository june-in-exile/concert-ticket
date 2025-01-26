// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TicketNFT} from "@src/ticketNFT.sol";

contract TicketNFTScript is Script {
    TicketNFT public ticketNFT;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        ticketNFT = new TicketNFT();

        vm.stopBroadcast();
    }
}
