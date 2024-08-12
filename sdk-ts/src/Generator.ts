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

    let txid = await this.createGenerator({
      label: params.generator.label,
      baseGeneratorFee: params.generator.baseGeneratorFee,
    })
    const res = await Utils.transactionCompletion(txid)
    const generatorId = res.parsedStack[0]

    const txids = []
    for await (const trait of params.generator.traits) {
      txid = await this.createTrait({
        generatorId,
        trait,
      })
      txids.push(txid)
    }
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
}
