import ERC20Artifact from '../artifacts/contracts/test/ERC20Mock.sol/ERC20Mock.json'
import { ERC20Mock as ERC20 } from '../typechain/ERC20Mock'

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import { ethers, waffle } from 'hardhat'
const { deployContract } = waffle
import { expect } from 'chai'


describe('ERC20', () => {
  let erc20: ERC20
  let erc20FromOther: ERC20
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

    erc20 = (await deployContract(signers[0], ERC20Artifact, ["Test", "TST"])) as ERC20
    erc20FromOther = erc20.connect(otherAcc)
  })

  describe('deployment', async () => {
    it('returns the name', async () => {
      expect(await erc20.name()).to.be.equal('Test')
    })

    it('mints', async () => {
      const balanceBefore = await erc20.balanceOf(other)
      await erc20.mint(other, 1)
      expect(await erc20.balanceOf(other)).to.be.equal(balanceBefore.add(1))
    })

    /*
    describe('with a positive balance', async () => {
      beforeEach(async () => {
        await erc20.mint(user1, 10, { from: user1 })
      })

      it('returns the total supply', async () => {
        const totalSupply = await erc20.totalSupply()
        totalSupply.toString().should.equal('10')
      })

      it('burns', async () => {
        const balanceBefore = await erc20.balanceOf(user1)
        await erc20.burn(user1, 1, { from: user1 })
        const balanceAfter = await erc20.balanceOf(user1)
        balanceAfter.toString().should.equal(balanceBefore.subn(1).toString())
      })

      it('transfers', async () => {
        const fromBalanceBefore = await erc20.balanceOf(user1)
        const toBalanceBefore = await erc20.balanceOf(user2)

        await erc20.transfer(user2, 1, { from: user1 })

        const fromBalanceAfter = await erc20.balanceOf(user1)
        const toBalanceAfter = await erc20.balanceOf(user2)

        fromBalanceAfter.toString().should.equal(fromBalanceBefore.subn(1).toString())
        toBalanceAfter.toString().should.equal(toBalanceBefore.addn(1).toString())
      })

      it('transfers using transferFrom', async () => {
        const balanceBefore = await erc20.balanceOf(user2)
        await erc20.transferFrom(user1, user2, 1, { from: user1 })
        const balanceAfter = await erc20.balanceOf(user2)
        balanceAfter.toString().should.equal(balanceBefore.addn(1).toString())
      })

      it('should not transfer beyond balance', async () => {
        await expectRevert(erc20.transfer(user2, 100, { from: user1 }), 'ERC20: Insufficient balance')
        await expectRevert(erc20.transferFrom(user1, user2, 100, { from: user1 }), 'ERC20: Insufficient balance')
      })

      it('approves to increase allowance', async () => {
        const allowanceBefore = await erc20.allowance(user1, user2)
        await erc20.approve(user2, 1, { from: user1 })
        const allowanceAfter = await erc20.allowance(user1, user2)
        allowanceAfter.toString().should.equal(allowanceBefore.addn(1).toString())
      })

      describe('with a positive allowance', async () => {
        beforeEach(async () => {
          await erc20.approve(user2, 10, { from: user1 })
        })

        it('transfers ether using transferFrom and allowance', async () => {
          const balanceBefore = await erc20.balanceOf(user2)
          await erc20.transferFrom(user1, user2, 1, { from: user2 })
          const balanceAfter = await erc20.balanceOf(user2)
          balanceAfter.toString().should.equal(balanceBefore.add(new BN('1')).toString())
        })

        it('should not transfer beyond allowance', async () => {
          await expectRevert(erc20.transferFrom(user1, user2, 20, { from: user2 }), 'ERC20: Insufficient approval')
        })
      })

      describe('with a maximum allowance', async () => {
        beforeEach(async () => {
          await erc20.approve(user2, MAX, { from: user1 })
        })

        it('does not decrease allowance using transferFrom', async () => {
          await erc20.transferFrom(user1, user2, 1, { from: user2 })
          const allowanceAfter = await erc20.allowance(user1, user2)
          allowanceAfter.toString().should.equal(MAX)
        })
      })
    })
    */
  })
})
