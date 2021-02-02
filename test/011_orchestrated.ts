import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import OrchestratedArtifact from '../artifacts/contracts/Orchestrated.sol/Orchestrated.json'
import { Orchestrated } from '../typechain/Orchestrated'

import { ethers, waffle } from 'hardhat'
import { id } from '../src'
import { expect } from 'chai'
const { deployContract } = waffle

describe('Orchestrated', () => {
  let ownerAcc: SignerWithAddress
  let owner: string
  let other: SignerWithAddress
  let orchestrated: Orchestrated

  before(async () => {
    const signers = await ethers.getSigners()
    ownerAcc = signers[0]
    owner = await ownerAcc.getAddress()

    other = signers[1]
  })

  beforeEach(async () => {
    orchestrated = (await deployContract(ownerAcc, OrchestratedArtifact, [])) as Orchestrated
  })

  it('non-admin cannot orchestrate', async () => {
    const mintSignature = id('mint(address,uint256)')
    await expect(orchestrated.connect(other).orchestrate(owner, mintSignature)).to.be.revertedWith(
      'Ownable: caller is not the owner'
    )
  })

  it('can orchestrate', async () => {
    const mintSignature = id('mint(address,uint256)')
    await orchestrated.orchestrate(owner, mintSignature)
    expect(await orchestrated.orchestration(owner, mintSignature)).to.be.true
  })

  it('can batch orchestrate', async () => {
    const sigs = ['mint', 'burn', 'transfer'].map((sig) => id(sig + '(address,uint256)'))
    await orchestrated.batchOrchestrate(owner, sigs)
    for (const sig of sigs) {
      expect(await orchestrated.orchestration(owner, sig)).to.be.true
    }
  })
})
