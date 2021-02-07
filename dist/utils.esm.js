import { BigNumber } from 'ethers';
import { keccak256, toUtf8Bytes, defaultAbiCoder, solidityPack, parseEther } from 'ethers/lib/utils';
import { ecsign } from 'ethereumjs-util';

var privateKey0 = /*#__PURE__*/Buffer.from('59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d', 'hex');
var privateKey1 = /*#__PURE__*/Buffer.from('5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a', 'hex');
var signPacked = function signPacked(digest, privateKey) {
  var _ecsign = ecsign(Buffer.from(digest.slice(2), 'hex'), privateKey),
      v = _ecsign.v,
      r = _ecsign.r,
      s = _ecsign.s;

  return '0x' + r.toString('hex') + s.toString('hex') + v.toString(16);
};
var sign = function sign(digest, privateKey) {
  return ecsign(Buffer.from(digest.slice(2), 'hex'), privateKey);
};
var SIGNATURE_TYPEHASH = /*#__PURE__*/keccak256( /*#__PURE__*/toUtf8Bytes('Signature(address user,address delegate,uint256 nonce,uint256 deadline)'));
var PERMIT_TYPEHASH = /*#__PURE__*/keccak256( /*#__PURE__*/toUtf8Bytes('Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)'));
var DAI_TYPEHASH = '0xea2aa0a1be11a07ed86d755c93467f4f82362b452371d1ba94d1715123511acb';
var CHAI_SEPARATOR = '0x0b50407de9fa158c2cba01a99633329490dfd22989a150c20e8c7b4c1fb0fcc3'; // Returns the EIP712 hash which should be signed by the user
// in order to make a call to `addDelegateBySignature`

function getSignatureDigest(name, address, chainId, signature, signatureCount, deadline) {
  var DOMAIN_SEPARATOR = getDomainSeparator(name, address, '1', chainId);
  return keccak256(solidityPack(['bytes1', 'bytes1', 'bytes32', 'bytes32'], ['0x19', '0x01', DOMAIN_SEPARATOR, keccak256(defaultAbiCoder.encode(['bytes32', 'address', 'address', 'uint256', 'uint256'], [SIGNATURE_TYPEHASH, signature.user, signature.delegate, signatureCount, deadline]))]));
} // Returns the EIP712 hash which should be signed by the user
// in order to make a call to `permit`

function getPermitDigest(name, address, version, chainId, approve, nonce, deadline) {
  var DOMAIN_SEPARATOR = getDomainSeparator(name, address, version, chainId);
  return keccak256(solidityPack(['bytes1', 'bytes1', 'bytes32', 'bytes32'], ['0x19', '0x01', DOMAIN_SEPARATOR, keccak256(defaultAbiCoder.encode(['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'], [PERMIT_TYPEHASH, approve.owner, approve.spender, approve.value, nonce, deadline]))]));
}
function getDaiDigest(name, address, chainId, approve, nonce, deadline) {
  var DOMAIN_SEPARATOR = getDomainSeparator(name, address, '1', chainId);
  return keccak256(solidityPack(['bytes1', 'bytes1', 'bytes32', 'bytes32'], ['0x19', '0x01', DOMAIN_SEPARATOR, keccak256(defaultAbiCoder.encode(['bytes32', 'address', 'address', 'uint256', 'uint256', 'bool'], [DAI_TYPEHASH, approve.owner, approve.spender, nonce, deadline, approve.can]))]));
} // Gets the EIP712 domain separator

function getDomainSeparator(name, contractAddress, version, chainId) {
  return keccak256(defaultAbiCoder.encode(['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'], [keccak256(toUtf8Bytes('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')), keccak256(toUtf8Bytes(name)), keccak256(toUtf8Bytes(version)), chainId, contractAddress]));
}
function getChaiDigest(approve, nonce, deadline) {
  return keccak256(solidityPack(['bytes1', 'bytes1', 'bytes32', 'bytes32'], ['0x19', '0x01', CHAI_SEPARATOR, keccak256(defaultAbiCoder.encode(['bytes32', 'address', 'address', 'uint256', 'uint256', 'bool'], [DAI_TYPEHASH, approve.owner, approve.spender, nonce, deadline, approve.can]))]));
}

var signatures = {
  __proto__: null,
  privateKey0: privateKey0,
  privateKey1: privateKey1,
  signPacked: signPacked,
  sign: sign,
  SIGNATURE_TYPEHASH: SIGNATURE_TYPEHASH,
  PERMIT_TYPEHASH: PERMIT_TYPEHASH,
  DAI_TYPEHASH: DAI_TYPEHASH,
  CHAI_SEPARATOR: CHAI_SEPARATOR,
  getSignatureDigest: getSignatureDigest,
  getPermitDigest: getPermitDigest,
  getDaiDigest: getDaiDigest,
  getDomainSeparator: getDomainSeparator,
  getChaiDigest: getChaiDigest
};

var wad = function wad(value) {
  return parseEther(value.toString());
}; // 10**27 precision

var rayExp = /*#__PURE__*/BigNumber.from(10).pow(27);
var ray = function ray(value) {
  return BigNumber.from(value).mul(rayExp);
}; // 10**45 precision

var radExp = /*#__PURE__*/BigNumber.from(10).pow(45);
var rad = function rad(value) {
  return BigNumber.from(value).mul(radExp);
};
var id = function id(signature) {
  return keccak256(toUtf8Bytes(signature)).slice(0, 10);
};

export { id, rad, ray, signatures, wad };
//# sourceMappingURL=utils.esm.js.map
