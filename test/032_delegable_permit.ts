import DelegableArtifact from '../artifacts/contracts/test/DelegableMock.sol/DelegableMock.json'
import { DelegableMock as Delegable } from '../typechain/DelegableMock'

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import { ethers, waffle } from 'hardhat'
const { deployContract } = waffle
import { expect } from 'chai'
import { getSignatureDigest, sign, privateKey0 } from '../src/signatures'

const chainId: number = 31337 // buidlerevm chain id
const delegableName: string = 'Yield'
const deadline: number = 100000000000000

describe('Delegable', () => {
  let delegable: Delegable
  let delegableFromOther: Delegable
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

    delegable = (await deployContract(signers[0], DelegableArtifact, [])) as Delegable
    delegableFromOther = delegable.connect(otherAcc)
  })

  it('adds delegates by permit', async () => {
    // Create the approval request
    const approve = {
      user: owner,
      delegate: other,
    }

    // Get the user's permit signature count
    const signatureCount = await delegable.signatureCount(owner)

    // Get the EIP712 digest
    const digest = getSignatureDigest(delegableName, delegable.address, chainId, approve, signatureCount, deadline)

    // Sign it
    const { v, r, s } = sign(digest, privateKey0)
    await delegable.addDelegateBySignature(
      approve.user,
      approve.delegate,
      deadline,
      v, r, s,
    )
    expect(await delegable.delegated(owner, other)).to.be.true
  })

  it('sanity check', async () => {
    // Create the approval request
    const approve = {
      user: owner,
      delegate: other,
    }

    // Get the user's permit signature count
    const signatureCount = await delegable.signatureCount(owner)

    // Get the EIP712 digest
    const digest = getSignatureDigest(delegableName, delegable.address, chainId, approve, signatureCount, deadline)

    // Sign it
    const { v, r, s } = sign(digest, privateKey0)
    await expect(
      delegable.addDelegateBySignature(
        other, // Change something
        approve.delegate,
        deadline,
        v, r, s,
      )
    ).to.be.revertedWith(
      'Delegable: Invalid signature'
    )
  })
})
