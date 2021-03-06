// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;


import "../token/ERC20Permit.sol";

contract ERC20PermitOverride is ERC20Permit {
    constructor(string memory name_, string memory symbol_) ERC20Permit(name_, symbol_, 18) { }

    function version() public pure override returns(string memory) { return "2"; }
}
