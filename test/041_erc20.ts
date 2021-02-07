import ERC20Artifact from '../artifacts/contracts/test/ERC20Mock.sol/ERC20Mock.json'
import { ERC20Mock as ERC20 } from '../typechain/ERC20Mock'

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import { ethers, waffle } from 'hardhat'
const { deployContract } = waffle
import { expect } from 'chai'

const MAX: string = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

describe('ERC20', () => {
  let erc20: ERC20
  let erc20FromOther: ERC20
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

    erc20 = (await deployContract(signers[0], ERC20Artifact, ["Test", "TST"])) as ERC20
    erc20FromOther = erc20.connect(otherAcc)
  })

  it('returns the name', async () => {
    expect(await erc20.name()).to.be.equal('Test')
  })

  it('mints', async () => {
    const balanceBefore = await erc20.balanceOf(owner)
    await erc20.mint(owner, 1)
    expect(await erc20.balanceOf(owner)).to.equal(balanceBefore.add(1))
  })

  describe('with a positive balance', async () => {
    beforeEach(async () => {
      await erc20.mint(owner, 10)
    })

    it('returns the total supply', async () => {
      expect(await erc20.totalSupply()).to.be.equal('10')
    })

    it('burns', async () => {
      const balanceBefore = await erc20.balanceOf(owner)
      await erc20.burn(owner, 1)
      expect(await erc20.balanceOf(owner)).to.equal(balanceBefore.sub(1))
    })

    it('transfers', async () => {
      const balanceOwner = await erc20.balanceOf(owner)
      const balanceOther = await erc20.balanceOf(other)
      await erc20.transfer(other, 1)
      expect(await erc20.balanceOf(owner)).to.equal(balanceOwner.sub(1))
      expect(await erc20.balanceOf(other)).to.equal(balanceOther.add(1))
    })

    it('transfers using transferFrom', async () => {
      const balanceOwner = await erc20.balanceOf(owner)
      const balanceOther = await erc20.balanceOf(other)
      await erc20.transferFrom(owner, other, 1)
      expect(await erc20.balanceOf(owner)).to.equal(balanceOwner.sub(1))
      expect(await erc20.balanceOf(other)).to.equal(balanceOther.add(1))
    })

    it('should not transfer beyond balance', async () => {
      await expect(erc20.transfer(other, 100)).to.be.revertedWith('ERC20: Insufficient balance')
    })

    it('approves to increase allowance', async () => {
      const allowanceBefore = await erc20.allowance(owner, other)
      await erc20.approve(other, 1)
      expect(await erc20.allowance(owner, other)).to.be.equal(allowanceBefore.add(1))
    })

    describe('with a positive allowance', async () => {
      beforeEach(async () => {
        await erc20.approve(other, 20)
      })

      it('transfers ether using transferFrom and allowance', async () => {
        const allowanceBefore = await erc20.allowance(owner, other)
        await erc20FromOther.transferFrom(owner, other, 1)
        expect(await erc20.allowance(owner, other)).to.be.equal(allowanceBefore.sub(1))
      })

      it('should not transfer beyond allowance', async () => {
        await expect(erc20FromOther.transferFrom(owner, other, 21)).to.be.revertedWith('ERC20: Insufficient approval')
      })

      it('should not transfer beyond balance', async () => {
        await expect(erc20.transferFrom(owner, other, 11)).to.be.revertedWith('ERC20: Insufficient balance')
      })
    })

    describe('with a maximum allowance', async () => {
      beforeEach(async () => {
        await erc20.approve(other, MAX)
      })

      it('does not decrease allowance using transferFrom', async () => {
        await erc20FromOther.transferFrom(owner, other, 1)
        expect(await erc20.allowance(owner, other)).to.be.equal(MAX)
      })
    })
  })
})
