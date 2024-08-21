import { wallet } from '@cityofzion/neon-core'
import { Generator, Utils } from '../dist/esm'
import { NetworkOption } from '../dist/esm/constants'

describe('Generator creation', function () {
  this.timeout(60000)
  let generator: Generator
  let account: wallet.Account
  let node: string
  beforeEach(async function () {
    // create a new class instance
    // account = new wallet.Account('f648c2f94ac19108433dd4763448c4c5ea2f13db8215ac1736637b8c6b00cf9b')
    node = NetworkOption.MainNet

    generator = new Generator({
      node,
      account,
    })
    console.log(account.address)
  })

  it('Should create a basic generator', async () => {
    const newGenerator = {
      label: 'SRD20 Base Attributes',
      baseGeneratorFee: 13800000,
      traits: [
        {
          label: 'Charisma',
          slots: 1,
          traitLevels: [
            {
              dropScore: 1000000,
              mintMode: 0,
              traits: [
                {
                  type: 3,
                  maxMint: -1,
                  args: {
                    collectionId: 1,
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Constitution',
          slots: 1,
          traitLevels: [
            {
              dropScore: 1000000,
              mintMode: 0,
              traits: [
                {
                  type: 3,
                  maxMint: -1,
                  args: {
                    collectionId: 1,
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Dexterity',
          slots: 1,
          traitLevels: [
            {
              dropScore: 1000000,
              mintMode: 0,
              traits: [
                {
                  type: 3,
                  maxMint: -1,
                  args: {
                    collectionId: 1,
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Intelligence',
          slots: 1,
          traitLevels: [
            {
              dropScore: 1000000,
              mintMode: 0,
              traits: [
                {
                  type: 3,
                  maxMint: -1,
                  args: {
                    collectionId: 1,
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Strength',
          slots: 1,
          traitLevels: [
            {
              dropScore: 10000,
              mintMode: 0,
              traits: [
                {
                  type: 3,
                  maxMint: -1,
                  args: {
                    collectionId: 1,
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Wisdom',
          slots: 1,
          traitLevels: [
            {
              dropScore: 1000000,
              mintMode: 0,
              traits: [
                {
                  type: 3,
                  maxMint: -1,
                  args: {
                    collectionId: 1,
                  },
                },
              ],
            },
          ],
        },
      ],
    }

    const txids = await generator.buildGenerator({
      generator: newGenerator,
    })

    let generatorId
    for (let i = 0; i < txids.length; i++) {
      const res = await Utils.transactionCompletion(txids[i], {
        node,
      })
      if (i === 0) {
        generatorId = res.parsedStack[0]
      }
    }
    console.log(`generator id: `, generatorId)

    const genRes = await generator.getGeneratorJSON({
      generatorId,
    })
    console.log(genRes)
  }).timeout(0)

  it('Should create a generator instance', async () => {
    const txid = await generator.createInstance({
      generatorId: 16,
    })
    const res = await Utils.transactionCompletion(txid, {
      node,
    })
    const instanceId = res.parsedStack[0]
    console.log('instance id: ', instanceId)

    const instance = await generator.getGeneratorInstanceJSON({
      instanceId,
    })
    console.log(instance)
  })

  it('Should set generator instance fees', async () => {
    const txid = await generator.setInstanceFee({
      instanceId: 26,
      fee: 100000,
    })
    const res = await Utils.transactionCompletion(txid, {
      node,
    })
    console.log(res.parsedStack)
  })

  it('Should optimize generator fees', async () => {
    await generator.optimizeFee({
      generatorId: 16,
      feeRange: [0, 10 ** 8],
      count: 2000,
    })
  }).timeout(0)

  it('Should set instance permissions', async () => {
    const txid = await generator.setInstanceAuthorizedContracts({
      instanceId: 26,
      contracts: [
        {
          scriptHash: '0x904deb56fdd9a87b48d89e0cc0ac3415f9207840',
          code: 26,
        },
      ],
    })
    const res = await Utils.transactionCompletion(txid, {
      node,
    })
    console.log(res.parsedStack)
  })

  it('Should set the access mode', async () => {
    const txid = await generator.setInstanceAccessMode({
      instanceId: 25,
      accessMode: 0,
    })
    const res = await Utils.transactionCompletion(txid, {
      node,
    })
    console.log(res.parsedStack)
  })

  it('Should mint', async () => {
    const instanceId = 25

    const txid = await generator.mintFromInstance({
      instanceId,
    })
    const mintRes = await Utils.transactionCompletion(txid, {
      node,
    })
    console.log(JSON.stringify(mintRes, null, 2))
  })

  it('Should create a nested generator, create an instance, and mint from it', async () => {
    const generatorInstanceId = 24

    const attributesTrait = {
      label: 'attributes',
      slots: 1,
      traitLevels: [
        {
          dropScore: 1000000,
          mintMode: 0,
          traits: [
            {
              type: 1,
              maxMint: -1,
              args: {
                scriptHash: '0x0e312c70ce6ed18d5702c6c5794c493d9ef46dc9',
                method: 'mint_from_instance',
                param: [{ type: 'Integer', value: generatorInstanceId }],
              },
            },
          ],
        },
      ],
    }

    const typeTrait = {
      label: 'type',
      slots: 1,
      traitLevels: [
        {
          dropScore: 1000000,
          mintMode: 0,
          traits: [
            {
              type: 0,
              maxMint: -1,
              args: {
                collectionId: 10,
                index: 0,
              },
            },
            {
              type: 0,
              maxMint: -1,
              args: {
                collectionId: 10,
                index: 1,
              },
            },
            {
              type: 0,
              maxMint: -1,
              args: {
                collectionId: 10,
                index: 2,
              },
            },
          ],
        },
      ],
    }
    /// //////////////////////
    /// Build the generator///

    const newGenerator = {
      label: 'BlockSpirits: Pilot Player',
      baseGeneratorFee: 8000000000,
      traits: [typeTrait, attributesTrait],
    }
    const txids = await generator.buildGenerator({
      generator: newGenerator,
    })

    let generatorId
    for (let i = 0; i < txids.length; i++) {
      const res = await Utils.transactionCompletion(txids[i], {
        node,
      })
      if (i === 0) {
        generatorId = res.parsedStack[0]
      }
    }
    console.log(`generator id: `, generatorId)

    const genRes = await generator.getGeneratorJSON({
      generatorId,
    })
    console.log(genRes)

    /// ///////////////////////
    /// //Create an instance//

    // create an instance of the generator
    let txid = await generator.createInstance({
      generatorId,
    })
    let res = await Utils.transactionCompletion(txid, {
      node,
    })
    const instanceId = res.parsedStack[0] as number

    /// /////////////////
    // set permissions

    txid = await generator.setInstanceAuthorizedContracts({
      instanceId: generatorInstanceId,
      contracts: [
        {
          scriptHash: '0x0e312c70ce6ed18d5702c6c5794c493d9ef46dc9',
          code: instanceId,
        },
      ],
    })
    res = await Utils.transactionCompletion(txid, {
      node,
    })
    console.log(res)

    /// ////////////////
    /// /mint//////////
    txid = await generator.mintFromInstance({
      instanceId,
    })
    res = await Utils.transactionCompletion(txid, {
      node,
    })
    console.log(res.parsedStack[0])
  }).timeout(0)
})
