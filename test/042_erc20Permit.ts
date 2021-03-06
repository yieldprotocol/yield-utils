import ERC20PermitArtifact from '../artifacts/contracts/test/ERC20PermitMock.sol/ERC20PermitMock.json'
import { ERC20PermitMock as ERC20Permit } from '../typechain/ERC20PermitMock'

import ERC20PermitOverrideArtifact from '../artifacts/contracts/test/ERC20PermitOverride.sol/ERC20PermitOverride.json'
import { ERC20PermitOverride } from '../typechain/ERC20PermitOverride'

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import { ethers, waffle } from 'hardhat'
const { deployContract } = waffle
import { expect } from 'chai'
import { PERMIT_TYPEHASH, getPermitDigest, getDomainSeparator, sign, privateKey1 } from '../src/signatures'

const chainId: number = 31337 // buidlerevm chain id
const deadline: number = 100000000000000

describe('ERC20Permit', () => {
  let erc20: ERC20Permit
  let erc20FromOther: ERC20Permit
  let erc20Override: ERC20PermitOverride
  let deployerAcc: SignerWithAddress
  let ownerAcc: SignerWithAddress
  let owner: string
  let otherAcc: SignerWithAddress
  let other: string

  beforeEach(async () => {
    const signers = await ethers.getSigners()
    deployerAcc = signers[0]
    ownerAcc = signers[1]
    owner = await ownerAcc.getAddress()
    otherAcc = signers[2]
    other = await otherAcc.getAddress()

    erc20 = (await deployContract(deployerAcc, ERC20PermitArtifact, [])) as ERC20Permit
    erc20FromOther = erc20.connect(otherAcc)

    erc20Override = (await deployContract(deployerAcc, ERC20PermitOverrideArtifact, [
      'Override',
      'OVR',
    ])) as ERC20PermitOverride
  })

  it('initializes DOMAIN_SEPARATOR and PERMIT_TYPEHASH correctly', async () => {
    expect(await erc20.PERMIT_TYPEHASH()).to.be.equal(PERMIT_TYPEHASH)

    expect(await erc20.DOMAIN_SEPARATOR()).to.be.equal(
      getDomainSeparator(await erc20.name(), erc20.address, await erc20.version(), chainId)
    )
  })

  it('overrides version', async () => {
    expect(await erc20Override.DOMAIN_SEPARATOR()).to.be.equal(
      getDomainSeparator(await erc20Override.name(), erc20Override.address, await erc20Override.version(), chainId)
    )
    expect(await erc20Override.DOMAIN_SEPARATOR()).to.be.not.equal(
      getDomainSeparator(await erc20Override.name(), erc20Override.address, await erc20.version(), chainId)
    )
  })

  it('permits and emits Approval (replay safe)', async () => {
    // Create the approval request
    const approve = {
      owner: owner,
      spender: other,
      value: 100,
    }

    // Get the EIP712 digest
    const digest = getPermitDigest(
      await erc20.DOMAIN_SEPARATOR(),
      approve,
      await erc20.nonces(owner),
      deadline
    )

    // Sign it
    const { v, r, s } = sign(digest, privateKey1)

    // Approve it
    await expect(erc20.permit(approve.owner, approve.spender, approve.value, deadline, v, r, s))
      .to.emit(erc20, 'Approval')
      .withArgs(owner, other, approve.value)

    // Re-using the same sig doesn't work since the nonce has been incremented
    // on the contract level for replay-protection
    await expect(erc20.permit(approve.owner, approve.spender, approve.value, deadline, v, r, s)).to.be.revertedWith(
      'ERC20Permit: invalid signature'
    )

    // invalid ecrecover's return address(0x0), so we must also guarantee that
    // this case fails
    await expect(
      erc20.permit('0x0000000000000000000000000000000000000000', approve.spender, approve.value, deadline, '0x99', r, s)
    ).to.be.revertedWith('ERC20Permit: invalid signature')
  })
})
