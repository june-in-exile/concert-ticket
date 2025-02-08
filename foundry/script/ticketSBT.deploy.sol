// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TicketSBT} from "@src/ticketSBT.sol";

contract TicketSBTScript is Script {
    TicketSBT public ticketSBT;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        ticketSBT = new TicketSBT();

        vm.stopBroadcast();
    }
}
