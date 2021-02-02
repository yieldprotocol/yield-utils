import DecimalMathArtifact from '../artifacts/contracts/test/DecimalMathMock.sol/DecimalMathMock.json'
import { DecimalMathMock as DecimalMath } from '../typechain/DecimalMathMock.d'

import { ethers, waffle } from 'hardhat'
const { deployContract } = waffle
import { expect } from 'chai'

import { ray } from '../src'

describe('DecimalMath', () => {
  let math: DecimalMath

  const one = ray('1')
  const two = ray('2')
  const three = ray('3')
  const six = ray('6')

  before(async () => {
    const signers = await ethers.getSigners()
    math = (await deployContract(signers[0], DecimalMathArtifact, [])) as DecimalMath
  })

  it('muld', async () => {
    expect(await math.muld_(two, three)).to.eq(six)
  })

  it('divd', async () => {
    expect(await math.divd_(six, three)).to.eq(two)
  })

  it('divdrup', async () => {
    expect(await math.divdrup_(six, three)).to.eq(two)
    expect(await math.divdrup_(one, three)).to.eq('333333333333333333333333334')
    expect(await math.divdrup_(1, two)).to.eq('1')
  })

  it('muldrup', async () => {
    expect(await math.muldrup_(two, three)).to.eq(six)
    expect(await math.muldrup_('6666666666666666666666666666', '300000000000000000000000000')).to.eq(two)
    expect(await math.muldrup_('1000000000000000000000000001', '1')).to.eq('2')
  })
})
