// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;
import "./IAuth.sol";


/// @dev Auth enables account owners to authorize management of their account by others.
contract Auth is IAuth {
    // keccak256("Signature(address owner,address other,uint256 nonce,uint256 deadline)");
    bytes32 public immutable AUTH_TYPEHASH = 0x3197033b0138feb01eb79ccfad01ef813247f401724310c2e37dbcb6736dd5e9;
    bytes32 public immutable AUTH_DOMAIN;
    mapping(address => uint) public override authCount;                               // index of the latest off-chain signature used
    mapping(address => mapping(address => bool)) public override authorized; // authorized[owner][other]

    constructor () {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }

        AUTH_DOMAIN = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("Auth")),
                keccak256(bytes(version())),
                chainId,
                address(this)
            )
        );
    }

    /// @dev Require that msg.sender is authorized by the owner
    modifier checkAuth(address owner, string memory errorMessage) {
        require(
            msg.sender == owner || authorized[owner][msg.sender],
            errorMessage
        );
        _;
    }

    /// @dev Verify a signature to allow one action to take place, without recording permanent permissions
    modifier authOnce(address owner, address other, uint deadline, uint8 v, bytes32 r, bytes32 s, string memory errorMessage) {
        require(_verifySignature(owner, other, deadline, v, r, s), "Auth: Invalid signature");
        _;
    }

    /// @dev Version of this contract, for use by EIP712
    function version() public pure override virtual returns(string memory) { return "1"; }

    /// @dev The caller authorizes other user
    function setAuth(address other) public override returns(bool) {
        return _setAuth(msg.sender, other);
    }

    /// @dev The caller revokes his authorization on other user
    function revokeAuth(address other) public override returns(bool) {
        return _revokeAuth(msg.sender, other);
    }

    /// @dev A user renounces to an authorization that has been given
    function renounceAuth(address owner) public override returns(bool) {
        return _revokeAuth(owner, msg.sender);
    }

    /// @dev Use an off-chain signature by an owner to authorize ohter user
    function setAuthBySignature(address owner, address other, uint deadline, uint8 v, bytes32 r, bytes32 s) public override returns (bool) {
        require(deadline >= block.timestamp, "Auth: Signature expired");
        require(_verifySignature(owner, other, deadline, v, r, s), "Auth: Invalid signature");
        return _setAuth(owner, other);
    }

    /// @dev Verify that a signature is valid for an owner, other user, and a deadline
    function _verifySignature(address owner, address other, uint deadline, uint8 v, bytes32 r, bytes32 s) public returns (bool) {
        bytes32 hashStruct = keccak256(
            abi.encode(
                AUTH_TYPEHASH,
                owner,
                other,
                authCount[owner]++,
                deadline
            )
        );

        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                AUTH_DOMAIN,
                hashStruct
            )
        );
        address signer = ecrecover(digest, v, r, s);
        return signer != address(0) && signer == owner;
    }

    /// @dev Authorize management of an account by other user
    function _setAuth(address owner, address other) internal returns (bool) {
        if (authorized[owner][other]) return false;
        authorized[owner][other] = true;
        emit Authorized(owner, other, true);

        return true;
    }

    /// @dev Revoke an authorization for account management
    function _revokeAuth(address owner, address other) internal returns (bool) {
        if (!authorized[owner][other]) return false;
        authorized[owner][other] = false;
        emit Authorized(owner, other, false);
        return true;
    }
}
