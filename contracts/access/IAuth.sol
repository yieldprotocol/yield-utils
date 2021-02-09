// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;


interface IAuth {
    function authCount(address) external view returns (uint256);
    function authorized(address, address) external view returns (bool);
    function version() external pure returns(string memory);
    function setAuth(address other) external returns(bool);
    function revokeAuth(address other) external returns(bool);
    function renounceAuth(address owner) external returns(bool);
    function setAuthBySignature(address owner, address other, uint deadline, uint8 v, bytes32 r, bytes32 s) external returns (bool);
    event Authorized(address indexed owner, address indexed other, bool enabled);
}
