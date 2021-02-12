import DelegableArtifact from '../artifacts/contracts/test/DelegableMock.sol/DelegableMock.json'
import { DelegableMock as Delegable } from '../typechain/DelegableMock'

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import { ethers, waffle } from 'hardhat'
const { deployContract } = waffle
import { expect } from 'chai'

describe('Delegable', () => {
  let delegable: Delegable
  let delegableFromOther: Delegable
  let ownerAcc: SignerWithAddress
  let owner: string
  let otherAcc: SignerWithAddress
  let other: string

  beforeEach(async () => {
    const signers = await ethers.getSigners()
    ownerAcc = signers[0]
    owner = await ownerAcc.getAddress()
    otherAcc = signers[1]
    other = await otherAcc.getAddress()

    delegable = (await deployContract(signers[0], DelegableArtifact, [])) as Delegable
    delegableFromOther = delegable.connect(otherAcc)
  })

  it('allows calling restricted functions to account owner', async () => {
    await delegable.restricted(owner)
  })

  it('does not allow calling restricted functions to others', async () => {
    await expect(delegableFromOther.restricted(owner)).to.be.revertedWith('DelegableMock: Forbidden')
  })

  it('does not allow revoking delegations that do not exist', async () => {
    await expect(delegable.revokeDelegate(other)).to.be.revertedWith('Delegable: Already undelegated')
  })

  it('adds delegates', async () => {
    await delegable.addDelegate(other)
    expect(await delegable.delegated(owner, other)).to.be.true
  })

  describe('with delegates', async () => {
    beforeEach(async () => {
      await delegable.addDelegate(other)
    })

    it('does not allow adding the same delegation twice', async () => {
      await expect(delegable.addDelegate(other)).to.be.revertedWith('Delegable: Already delegated')
    })

    it('allows calling restricted functions to delegates', async () => {
      await delegableFromOther.restricted(owner)
    })

    it('revokes delegates', async () => {
      await delegable.revokeDelegate(other)
      expect(await delegable.delegated(owner, other)).to.be.false
    })
  })
})
