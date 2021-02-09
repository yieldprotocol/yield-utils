// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;


/// @dev Implements simple fixed point math mul and div operations for 27 decimals.
contract DecimalMath {

    uint256 constant public UNIT = 1e27;

    /// @dev Multiplies x and y, assuming they are both fixed point with 27 digits.
    function muld(uint256 x, uint256 y) internal pure returns (uint256) {
        return x * y / UNIT;
    }

    /// @dev Divides x between y, assuming they are both fixed point with 27 digits.
    function divd(uint256 x, uint256 y) internal pure returns (uint256) {
        return x * UNIT / y;
    }

    /// @dev Multiplies x and y, rounding up to the closest representable number.
    /// Assumes x and y are both fixed point with `decimals` digits.
    function muldrup(uint256 x, uint256 y) internal pure returns (uint256)
    {
        uint256 z = x * y;
        return z % UNIT == 0 ? z / UNIT : z / UNIT + 1;
    }

    /// @dev Divides x between y, rounding up to the closest representable number.
    /// Assumes x and y are both fixed point with `decimals` digits.
    function divdrup(uint256 x, uint256 y) internal pure returns (uint256)
    {
        uint256 z = x * UNIT;
        return z % y == 0 ? z / y : z / y + 1;
    }
}
