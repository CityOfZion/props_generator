import { Generator } from '../dist/esm'
import { NetworkOption } from '../dist/esm/constants/config'
import { wallet } from '@cityofzion/neon-core'
import { assert } from 'chai'

describe('Basic Collection Test Suite', function () {
    this.timeout(60000)
    let generator: Generator

    beforeEach(async function () {
        // create a new class instance
        generator = new Generator({
            node: NetworkOption.LocalNet, // change this if you want to connect to mainnet
            account: new wallet.Account(''),
        })
    })

    it('should get the total generator count', async () => {
        const total = await generator.totalGenerators()
        console.log(total)
    })

    it('should get all of the generators', async () => {
        const total = await generator.totalGenerators()
        for (let i = 1; i<= total; i++) {
            const gen = await generator.getGeneratorJSON({
                generatorId: i
            })
            console.log(gen)
        }
    })
})

