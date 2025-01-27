// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "@src/ticketNFT.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TicketNFTTest is Test {
    TicketNFT public ticketNFT;
    address public alice = address(0x1);
    address public bob = address(0x2);

    function setUp() external {
        ticketNFT = new TicketNFT();
    }

    function testFirstTicket() public {
        vm.startPrank(alice);
        ticketNFT.buyTicket();
        vm.expectRevert(IERC721Errors.ERC721NonexistentToken.selector, 0);
        ticketNFT.ownerOf(0);
        assertEq(ticketNFT.ownerOf(1), alice);
        vm.stopPrank();
    }

    function testBuyTicket() public {
        vm.startPrank(alice);
        ticketNFT.buyTicket();
        assertEq(ticketNFT.ownerOf(1), alice);
        assertTrue(ticketNFT.isTicketValid(1));
        vm.stopPrank();
    }

    function testBuyTickets() public {
        vm.startPrank(alice);
        ticketNFT.buyTicket();
        ticketNFT.buyTicket();
        assertTrue(ticketNFT.isTicketValid(1));
        assertTrue(ticketNFT.isTicketValid(2));
        assertEq(ticketNFT.ownerOf(1), alice);
        assertEq(ticketNFT.ownerOf(2), alice);
        vm.stopPrank();
    }

    function testValidateTicketNotOwner() public {
        vm.prank(alice);
        ticketNFT.buyTicket();
        vm.prank(bob);
        vm.expectRevert("You are not the owner of this ticket");
        ticketNFT.isTicketValid(1);
    }

    function testCancelTicket() public {
        vm.startPrank(alice);
        ticketNFT.buyTicket();
        ticketNFT.cancelTicket(1);
        assertFalse(ticketNFT.isTicketValid(1));
        vm.stopPrank();
    }

    function testCancelTicketNotOwner() public {
        vm.prank(alice);
        ticketNFT.buyTicket();
        vm.prank(bob);
        vm.expectRevert("You are not the owner of this ticket");
        ticketNFT.cancelTicket(1);
    }

    function testCancelInvalidTicket() public {
        vm.prank(alice);
        ticketNFT.buyTicket();
        vm.prank(alice);
        ticketNFT.cancelTicket(1);
        vm.prank(alice);
        vm.expectRevert("Ticket is already invalid");
        ticketNFT.cancelTicket(1);
    }

    function testGetMyTickets() public {
        vm.startPrank(alice);
        ticketNFT.buyTicket(); // 1
        ticketNFT.buyTicket(); // 2
        ticketNFT.buyTicket(); // 3
        ticketNFT.cancelTicket(1);
        vm.stopPrank();

        vm.startPrank(bob);
        ticketNFT.buyTicket(); // 4
        ticketNFT.buyTicket(); // 5
        ticketNFT.cancelTicket(5);
        vm.stopPrank();

        uint256[] memory aliceTickets = new uint256[](3);
        aliceTickets[0] = 2;
        aliceTickets[1] = 3;
        aliceTickets[2] = 0;

        uint256[] memory bobTickets = new uint256[](2);
        bobTickets[0] = 4;
        bobTickets[1] = 0;

        vm.prank(alice);
        assertEq(ticketNFT.getMyTickets(), aliceTickets);
        vm.prank(bob);
        assertEq(ticketNFT.getMyTickets(), bobTickets);
    }
}
