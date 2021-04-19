// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "../token/ERC20Permit.sol";

contract ERC20PermitMock is ERC20Permit {
    constructor () ERC20Permit("Test", "TST", 18) { }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public {
        _burn(from, amount);
    }
}
