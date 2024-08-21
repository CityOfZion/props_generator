import { GeneratorAPI } from './api'
import {
  ConstructorOptions,
  GeneratorInstanceType,
  GeneratorType,
  CreateGenerator,
  CreateTrait,
  GetGeneratorInstanceJSON,
  SetInstanceAccessMode,
  SetInstanceAuthorizedUsers,
  SetInstanceAuthorizedContracts,
  SetInstanceFee,
} from './types'
import { rpc } from '@cityofzion/neon-core'
import { NetworkOption } from './constants/config'
import { NeonInvoker, NeonParser } from '@cityofzion/neon-dappkit'
import { Utils } from './helpers'

const DEFAULT_OPTIONS: ConstructorOptions = {
  node: NetworkOption.MainNet,
  scriptHash: '0x0e312c70ce6ed18d5702c6c5794c493d9ef46dc9',
  parser: NeonParser,
  account: undefined,
}

export class Generator {
  private config: ConstructorOptions
  private initialized: boolean

  constructor(configOptions: ConstructorOptions = {}) {
    this.initialized = 'invoker' in configOptions
    this.config = { ...DEFAULT_OPTIONS, ...configOptions }
  }

  /**
   * DO NOT EDIT ME
   * The contract script hash that is being interfaced with.
   */
  get scriptHash(): string {
    if (this.config.scriptHash) {
      return this.config.scriptHash
    }
    throw new Error('no scripthash defined')
  }

  get node(): rpc.RPCClient {
    if (this.config.node) {
      return new rpc.RPCClient(this.config.node!)
    }
    throw new Error('no node selected!')
  }

  async init(): Promise<boolean> {
    if (!this.initialized) {
      this.config.invoker = await NeonInvoker.init({
        rpcAddress: this.config.node as string,
        account: this.config.account,
      })
      this.initialized = true
    }
    return true
  }

  /// ///////////////////////////////////////////////////
  /// ///////////////////////////////////////////////////
  /// /////////////CONTRACT METHODS//////////////////////
  /// ///////////////////////////////////////////////////
  /// ///////////////////////////////////////////////////

  async createGenerator(params: CreateGenerator): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [GeneratorAPI.createGenerator(this.config.scriptHash!, params)],
      signers: [],
    })
  }

  async buildGenerator(params: { generator: GeneratorType }): Promise<string[]> {
    await this.init()

    const txids = []
    let txid = await this.createGenerator({
      label: params.generator.label,
      baseGeneratorFee: params.generator.baseGeneratorFee,
    })
    txids.push(txid)

    const res = await Utils.transactionCompletion(txid, {
      node: this.node.url,
    })
    const generatorId = res.parsedStack[0]

    const traitInvocations = []
    for (let i = 0; i < params.generator.traits.length; i++) {
      const invoke = GeneratorAPI.createTrait(this.config.scriptHash!, {
        generatorId,
        trait: params.generator.traits[i],
      })
      traitInvocations.push(invoke)
    }

    txid = await this.config.invoker!.invokeFunction({
      invocations: traitInvocations,
      signers: [],
    })
    txids.push(txid)
    return txids
  }

  // TODO
  /*
    async createGeneratorFromFile(): Promise<string> {
        await this.init()
        return await this.config.invoker!.invokeFunction({
            invocations: [GeneratorAPI.createGenerator(this.config.scriptHash!, params)],
            signers: [],
        })    }

     */

  async createTrait(params: CreateTrait): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [GeneratorAPI.createTrait(this.config.scriptHash!, params)],
      signers: [],
    })
  }

  async getGeneratorJSON(params: { generatorId: number }): Promise<GeneratorType> {
    await this.init()
    const res = await this.config.invoker!.testInvoke({
      invocations: [GeneratorAPI.getGeneratorJSON(this.config.scriptHash!, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser!.parseRpcResponse(res.stack[0])
  }

  async getGeneratorInstanceJSON(params: GetGeneratorInstanceJSON): Promise<GeneratorInstanceType> {
    await this.init()
    const res = await this.config.invoker!.testInvoke({
      invocations: [GeneratorAPI.getGeneratorInstanceJSON(this.config.scriptHash!, params)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }
    return this.config.parser!.parseRpcResponse(res.stack[0])
  }

  async createInstance(params: { generatorId: number }): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [GeneratorAPI.createInstance(this.config.scriptHash!, params)],
      signers: [],
    })
  }

  async mintFromInstance(params: { instanceId: number }): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [GeneratorAPI.mintFromInstance(this.config.scriptHash!, params)],
      signers: [],
    })
  }

  async setInstanceAccessMode(params: SetInstanceAccessMode): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [GeneratorAPI.setInstanceAccessMode(this.config.scriptHash!, params)],
      signers: [],
    })
  }

  async setInstanceAuthorizedUsers(params: SetInstanceAuthorizedUsers): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [GeneratorAPI.setInstanceAuthorizedUsers(this.config.scriptHash!, params)],
      signers: [],
    })
  }

  async setInstanceAuthorizedContracts(params: SetInstanceAuthorizedContracts): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [GeneratorAPI.setInstanceAuthorizedContracts(this.config.scriptHash!, params)],
      signers: [],
    })
  }

  async setInstanceFee(params: SetInstanceFee): Promise<string> {
    await this.init()
    return await this.config.invoker!.invokeFunction({
      invocations: [GeneratorAPI.setInstanceFee(this.config.scriptHash!, params)],
      signers: [],
    })
  }

  async totalGenerators(): Promise<number> {
    await this.init()
    const res = await this.config.invoker!.testInvoke({
      invocations: [GeneratorAPI.totalGenerators(this.config.scriptHash!)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser!.parseRpcResponse(res.stack[0])
  }

  async totalGeneratorInstances(): Promise<number> {
    await this.init()
    const res = await this.config.invoker!.testInvoke({
      invocations: [GeneratorAPI.totalGeneratorInstances(this.config.scriptHash!)],
      signers: [],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }

    return this.config.parser!.parseRpcResponse(res.stack[0])
  }

  async testFee(params: { generatorId: number; fee: number; count: number }) {
    await this.init()

    let txid = await this.createInstance({
      generatorId: params.generatorId,
    })
    let res = await Utils.transactionCompletion(txid, {
      node: this.config.node!,
    })
    const instanceId = res.parsedStack[0]

    txid = await this.setInstanceAuthorizedContracts({
      instanceId: 24,
      contracts: [
        {
          scriptHash: '0x0e312c70ce6ed18d5702c6c5794c493d9ef46dc9',
          code: instanceId,
        },
      ],
    })

    res = await Utils.transactionCompletion(txid, {
      node: this.config.node!,
    })

    txid = await this.setInstanceFee({
      instanceId,
      fee: params.fee,
    })
    res = await Utils.transactionCompletion(txid, {
      node: this.config.node!,
    })
    console.log('  set instance fee: ', instanceId, res.parsedStack[0])

    try {
      // mint using the fee
      const txids = []
      for (let i = 0; i < params.count; i++) {
        const txid = await this.mintFromInstance({
          instanceId,
        })
        txids.push(txid)
      }

      for (let i = 0; i < txids.length; i++) {
        await Utils.transactionCompletion(txid, {
          node: this.config.node!,
        })
      }
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async optimizeFee(params: { generatorId: number; feeRange?: number[]; count?: number }) {
    await this.init()

    // assert that the account is the owner of the generator

    const feeRange = params.feeRange ? params.feeRange : [0, 10 ** 8]
    const count = params.count ? params.count : 1500
    let fee
    let res
    while (1) {
      fee = (feeRange[0] + feeRange[1]) / 2
      console.log(`running ${fee / 10 ** 8} GAS`)

      res = await this.testFee({
        generatorId: params.generatorId,
        fee,
        count,
      })

      console.log(`  ${res}`)

      if (!res) {
        feeRange[0] = fee
      } else {
        feeRange[1] = fee
      }

      if (feeRange[1] - feeRange[0] < 0.001 * 10 ** 8) {
        console.log(`Optimized generator fee: ${feeRange[1]} | ${feeRange[1] / 10 ** 8} GAS`)
        return
      }
    }
  }
}
