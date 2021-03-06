// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;
import "../../token/IERC20.sol";


interface IWeth is IERC20 {
    function deposit() external payable;
    function withdraw(uint) external;
}