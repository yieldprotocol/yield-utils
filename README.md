# Yield Utils
This repo contains contracts used for Yield projects that can be reused.
 - DecimalMath.sol - Fixed point safe math.
 - Delegable.sol - Permission delegation, including through off-chain signatures.
 - ERC20Permit.sol - ERC20 with ERC2612 `permit`.
 - Orchestrated.sol - Access control for static contracts.
 - SafeCast.sol - Safely cast between types.
 - YieldAuth.sol - Use packed off-chain signatures, from 3 arguments to 1.

## Bug Bounty
Yield is offering bounties for bugs disclosed to us at [security@yield.is](mailto:security@yield.is). The bounty reward is up to $25,000, depending on severity. Please include full details of the vulnerability and steps/code to reproduce. We ask that you permit us time to review and remediate any findings before public disclosure.

## Contributing
If you have a contribution to make, please reach us out on Discord and we will consider it for a future release or product.

## ChangeLog
 - 1.2.1 - Simplified `permit` off-chain calculations.
 - 1.2.0 - Upgrade to Solidity 0.8
 - 1.1.0 - Replaced OpenZeppelin's ERC20 for our own.
 - 1.0.0 - Contracts released as part of Yield v1

## License
All files in this repository are released under the [GPLv3](https://github.com/yieldprotocol/fyDai/blob/master/LICENSE.md) license.
