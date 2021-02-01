# Yield Utils
This repo contains contracts used for Yield projects that can be reused.
 - DecimalMath.sol - Fixed point safe math.
 - Delegable.sol - Permission delegation, including through off-chain signatures.
 - ERC20Permit.sol - ERC20 with ERC2612 `permit`.
 - Orchestrated.sol - Access control for static contracts.
 - SafeCast.sol - Safely cast between types.
 - YieldAuth.sol - Use packed off-chain signatures, from 3 arguments to 1.

## Security
In developing the code in this repository we have set the highest bar possible for security. We have been fully audited by [Trail of Bits](https://www.trailofbits.com/), with the [results](https://github.com/trailofbits/publications/blob/master/reviews/YieldProtocol.pdf) publicly available. We have also used fuzzing tests for the Pool and YieldMath contracts, allowing us to find edge cases and vulnerabilities that we would have missed otherwise.

## Bug Bounty
Yield is offering bounties for bugs disclosed to us at [security@yield.is](mailto:security@yield.is). The bounty reward is up to $25,000, depending on severity. Please include full details of the vulnerability and steps/code to reproduce. We ask that you permit us time to review and remediate any findings before public disclosure.

## Contributing
This project doesn't include any governance or upgradability features. If you have a contribution to make, please reach us out on Discord and we will consider it for a future release or product.

## Acknowledgements
We would like to thank Dan Robinson (Paradigm), Georgios Konstantopoulos (Paradigm), Sam Sun (Paradigm), Mikhail Vladimirov (ABDK), Gustavo Grieco (Trail of Bits), Martin Lundfall (dAppHub) and Noah Zinsmeister (Uniswap) for their feedback and advice. We wouldn't be here without them.

## License
All files in this repository are released under the [GPLv3](https://github.com/yieldprotocol/fyDai/blob/master/LICENSE.md) license.
