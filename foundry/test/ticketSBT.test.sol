// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "@src/ticketSBT.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TicketSBTTest is Test {
    TicketSBT public ticketSBT;
    address public alice = address(0x1);
    address public bob = address(0x2);
    address public cara = address(0x3);

    function setUp() external {
        ticketSBT = new TicketSBT();
    }

    function testValidateTicketsNotExist() public {
        vm.startPrank(alice);
        assertFalse(ticketSBT.isMyTicket(0));
        vm.expectRevert(abi.encodeWithSelector(IERC721Errors.ERC721NonexistentToken.selector, 0));
        ticketSBT.ownerOf(0);
        assertFalse(ticketSBT.isMyTicket(1));
        vm.expectRevert(abi.encodeWithSelector(IERC721Errors.ERC721NonexistentToken.selector, 1));
        ticketSBT.ownerOf(1);
        vm.stopPrank();
    }

    function testBuyTicket() public {
        vm.startPrank(alice);
        ticketSBT.buyTicket();
        assertFalse(ticketSBT.isMyTicket(0));
        assertTrue(ticketSBT.isMyTicket(1));
        vm.expectRevert(abi.encodeWithSelector(IERC721Errors.ERC721NonexistentToken.selector, 0));
        ticketSBT.ownerOf(0);
        assertEq(ticketSBT.ownerOf(1), alice);
        vm.stopPrank();
    }

    function testBuyTickets() public {
        vm.startPrank(alice);
        ticketSBT.buyTicket();
        ticketSBT.buyTicket();
        assertTrue(ticketSBT.isMyTicket(1));
        assertTrue(ticketSBT.isMyTicket(2));
        assertEq(ticketSBT.ownerOf(1), alice);
        assertEq(ticketSBT.ownerOf(2), alice);
        vm.stopPrank();
    }

    function testValidateTicketNotOwner() public {
        vm.prank(alice);
        ticketSBT.buyTicket();
        vm.prank(bob);
        assertFalse(ticketSBT.isMyTicket(1));
    }

    function testCancelTicket() public {
        vm.startPrank(alice);
        ticketSBT.buyTicket();
        assertTrue(ticketSBT.isMyTicket(1));
        ticketSBT.cancelTicket(1);
        assertFalse(ticketSBT.isMyTicket(1));
        vm.stopPrank();
    }

    function testCancelTicketNotOwner() public {
        vm.prank(alice);
        ticketSBT.buyTicket();
        vm.prank(bob);
        vm.expectRevert("You are not the owner of this ticket");
        ticketSBT.cancelTicket(1);
    }

    function testCancelInvalidTickets() public {
        vm.startPrank(alice);
        ticketSBT.buyTicket();
        ticketSBT.cancelTicket(1);
        vm.expectRevert("You are not the owner of this ticket");
        ticketSBT.cancelTicket(0);
        vm.expectRevert("You are not the owner of this ticket");
        ticketSBT.cancelTicket(1);
        vm.expectRevert("You are not the owner of this ticket");
        ticketSBT.cancelTicket(2);
        vm.stopPrank();
    }

    function testGetMyTickets() public {
        vm.startPrank(alice);
        ticketSBT.buyTicket(); // 1
        ticketSBT.buyTicket(); // 2
        ticketSBT.buyTicket(); // 3
        ticketSBT.cancelTicket(2);
        vm.stopPrank();

        vm.startPrank(bob);
        ticketSBT.buyTicket(); // 4
        ticketSBT.buyTicket(); // 5
        ticketSBT.cancelTicket(5);
        vm.stopPrank();

        uint256[] memory aliceTickets = new uint256[](2);
        aliceTickets[0] = 1;
        aliceTickets[1] = 3;

        uint256[] memory bobTickets = new uint256[](1);
        bobTickets[0] = 4;

        vm.prank(alice);
        assertEq(ticketSBT.getMyTickets(), aliceTickets);
        vm.prank(bob);
        assertEq(ticketSBT.getMyTickets(), bobTickets);
    }

    function testTransferFromInvalid() public {
        vm.prank(alice);
        ticketSBT.buyTicket();

        vm.prank(alice);
        vm.expectRevert(TicketSBT.ErrLocked.selector);
        ticketSBT.transferFrom(alice, bob, 1);

        vm.prank(alice);
        assertTrue(ticketSBT.isMyTicket(1));

        vm.prank(bob);
        assertFalse(ticketSBT.isMyTicket(1));
    }

    function testSafeTransferFromInvalid() public {
        vm.prank(alice);
        ticketSBT.buyTicket();

        vm.prank(alice);
        vm.expectRevert(TicketSBT.ErrLocked.selector);
        ticketSBT.safeTransferFrom(alice, bob, 1);

        vm.prank(alice);
        assertTrue(ticketSBT.isMyTicket(1));

        vm.prank(bob);
        assertFalse(ticketSBT.isMyTicket(1));
    }

    function testApproveInvalid() public {
        vm.prank(alice);
        ticketSBT.buyTicket();
        
        vm.prank(alice);
        vm.expectRevert(TicketSBT.ErrLocked.selector);
        ticketSBT.approve(cara, 1);
    }

    function testSetApprovalForAllInvalid() public {
        vm.prank(alice);
        ticketSBT.buyTicket();

        vm.prank(alice);
        ticketSBT.buyTicket();

        vm.prank(alice);
        vm.expectRevert(TicketSBT.ErrLocked.selector);
        ticketSBT.setApprovalForAll(cara, true);
    }
}
