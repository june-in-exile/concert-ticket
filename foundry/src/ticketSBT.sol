// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IERC5192.sol";

// Reference to https://github.com/attestate/ERC5192/blob/main/src/ERC5192.sol
contract TicketNFT is ERC721, IERC5192 {
    uint256 private _nextTokenId;
    bool private isLocked;

    error ErrLocked();
    error ErrNotFound();

    event TicketBought(address indexed from, uint256 tokenId);
    event TicketCancelled(address indexed from, uint256 tokenId);

    constructor() ERC721("TicketNFT", "TNFT") {
        _nextTokenId = 1;
        isLocked = true;
    }

    modifier checkLock() {
        if (isLocked) revert ErrLocked();
        _;
    }

    function locked(uint256 tokenId) external view returns (bool) {
        if (_ownerOf(tokenId) == address(0)) revert ErrNotFound();
        return isLocked;
    }

    function buyTicket() external {
        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);
        _nextTokenId++;

        emit TicketBought(msg.sender, tokenId);
    }

    function cancelTicket(uint256 tokenId) external {
        require(isMyTicket(tokenId), "You are not the owner of this ticket");
        _burn(tokenId);

        emit TicketCancelled(msg.sender, tokenId);
    }

    function isMyTicket(uint256 tokenId) public view returns (bool) {
        return (_ownerOf(tokenId) == msg.sender);
    }

    function getMyTickets() external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(msg.sender);
        uint256[] memory ownedTickets = new uint256[](tokenCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i < _nextTokenId; i++) {
            if (isMyTicket(i)) {
                ownedTickets[currentIndex++] = i;
            }
        }
        return ownedTickets;
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override checkLock {
        super.safeTransferFrom(from, to, tokenId, data);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override checkLock {
        super.safeTransferFrom(from, to, tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override checkLock {
        super.transferFrom(from, to, tokenId);
    }

    function approve(
        address approved,
        uint256 tokenId
    ) public override checkLock {
        super.approve(approved, tokenId);
    }

    function setApprovalForAll(
        address operator,
        bool approved
    ) public override checkLock {
        super.setApprovalForAll(operator, approved);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override returns (bool) {
        return
            interfaceId == type(IERC5192).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
