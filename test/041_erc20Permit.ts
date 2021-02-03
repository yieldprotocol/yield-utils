import ERC20PermitArtifact from '../artifacts/contracts/test/ERC20PermitMock.sol/ERC20PermitMock.json'
import { ERC20PermitMock as ERC20Permit } from '../typechain/ERC20PermitMock'

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import { ethers, waffle } from 'hardhat'
const { deployContract } = waffle
import { expect } from 'chai'
import { PERMIT_TYPEHASH, getPermitDigest, getDomainSeparator, sign, privateKey0 } from '../src/signatures'

const chainId: number = 31337 // buidlerevm chain id
const deadline: number = 100000000000000

describe('ERC20Permit', () => {
  let erc20: ERC20Permit
  let erc20FromOther: ERC20Permit
  let ownerAcc: SignerWithAddress
  let owner: string
  let otherAcc: SignerWithAddress
  let other: string

  beforeEach(async () => {
    const signers = await ethers.getSigners()
    ownerAcc = signers[1]
    owner = await ownerAcc.getAddress()
    otherAcc = signers[2]
    other = await otherAcc.getAddress()

    erc20 = (await deployContract(signers[0], ERC20PermitArtifact, [])) as ERC20Permit
    erc20FromOther = erc20.connect(otherAcc)
  })

  it('initializes DOMAIN_SEPARATOR and PERMIT_TYPEHASH correctly', async () => {
    expect(await erc20.PERMIT_TYPEHASH()).to.be.equal(PERMIT_TYPEHASH)

    expect(await erc20.DOMAIN_SEPARATOR()).to.be.equal(getDomainSeparator(await erc20.name(), erc20.address, chainId))
  })

  it('permits and emits Approval (replay safe)', async () => {
    // Create the approval request
    const approve = {
      owner: owner,
      spender: other,
      value: 100,
    }

    // Get the user's nonce
    const nonce = await erc20.nonces(owner)

    // Get the EIP712 digest
    const digest = getPermitDigest(await erc20.name(), erc20.address, chainId, approve, nonce, deadline)

    // Sign it
    const { v, r, s } = sign(digest, privateKey0)

    // Approve it
    await expect(erc20.permit(approve.owner, approve.spender, approve.value, deadline, v, r, s))
    .to.emit(erc20, 'Approval')
    .withArgs(owner, other, approve.value)

    // Re-using the same sig doesn't work since the nonce has been incremented
    // on the contract level for replay-protection
    await expect(
      erc20.permit(approve.owner, approve.spender, approve.value, deadline, v, r, s)
    ).to.be.revertedWith(
      'ERC20Permit: invalid signature'
    )

    // invalid ecrecover's return address(0x0), so we must also guarantee that
    // this case fails
    await expect(
      erc20.permit(
        '0x0000000000000000000000000000000000000000',
        approve.spender,
        approve.value,
        deadline,
        '0x99',
        r,
        s
      )
    ).to.be.revertedWith(
      'ERC20Permit: invalid signature'
    )
  })
})
