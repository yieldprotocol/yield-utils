// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../token/ERC20.sol";

contract ERC20Mock is ERC20 {

    constructor (string memory name, string memory symbol) ERC20(name, symbol, 18) {}

    /// @dev Give free tokens to anyone
    function mint(address dst, uint256 amount) external {
        _mint(dst, amount);
    }

    /// @dev Burn free tokens from anyone
    function burn(address src, uint256 amount) external {
        _burn(src, amount);
    }
}