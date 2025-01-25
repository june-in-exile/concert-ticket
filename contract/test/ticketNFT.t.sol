// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../src/TicketNFT.sol";

contract TicketNFTTest is Test {
    TicketNFT public ticketNFT;
    address public alice = address(0x1);
    address public bob = address(0x2);

    function setUp() external {
        ticketNFT = new TicketNFT();
    }

    function testBuyTicket() public {
        vm.prank(alice);
        ticketNFT.buyTicket();
        assertEq(ticketNFT.ownerOf(0), alice);
        assertTrue(ticketNFT.isTicketValid(0));
    }

    function testCancelTicket() public {
        vm.prank(alice);
        ticketNFT.buyTicket();
        vm.prank(alice);
        ticketNFT.cancelTicket(0);
        assertFalse(ticketNFT.isTicketValid(0));
    }

    function testCancelTicketNotOwner() public {
        vm.prank(alice);
        ticketNFT.buyTicket();
        vm.prank(bob);
        vm.expectRevert("You are not the owner of this ticket");
        ticketNFT.cancelTicket(0);
    }

    function testCancelInvalidTicket() public {
        vm.prank(alice);
        ticketNFT.buyTicket();
        vm.prank(alice);
        ticketNFT.cancelTicket(0);
        vm.prank(alice);
        vm.expectRevert("Ticket is already invalid");
        ticketNFT.cancelTicket(0);
    }
}
