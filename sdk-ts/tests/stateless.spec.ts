import { Generator } from '../dist/esm'
import { NetworkOption } from '../dist/esm/constants'
import { wallet } from '@cityofzion/neon-core'

describe('Basic Collection Test Suite', function () {
  this.timeout(60000)
  let generator: Generator

  const node = NetworkOption.LocalNet
  beforeEach(async function () {
    // create a new class instance
    generator = new Generator({
      node,
      account: new wallet.Account(''),
    })
  })

  it('should get the total generator count', async () => {
    const total = await generator.totalGenerators()
    console.log(total)
  })

  it('should get all of the generators', async () => {
    const total = await generator.totalGenerators()
    for (let i = 1; i <= total; i++) {
      const gen = await generator.getGeneratorJSON({
        generatorId: i,
      })
      console.log(i, gen)
    }
  })

  it('should get a generator instance', async () => {
    const instance = await generator.getGeneratorInstanceJSON({
      instanceId: 25,
    })
    console.log(JSON.stringify(instance, null, 2))
  })

  it('should get all of the generator instances', async () => {
    const totalInstances = await generator.totalGeneratorInstances()
    console.log('total instances: ', totalInstances)
    for (let i = 1; i <= totalInstances; i++) {
      const instance = await generator.getGeneratorInstanceJSON({
        instanceId: i,
      })
      console.log(i, instance)
    }
  })
})
