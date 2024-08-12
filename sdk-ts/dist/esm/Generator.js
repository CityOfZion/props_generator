import { GeneratorAPI } from './api';
import { rpc } from '@cityofzion/neon-core';
import { NetworkOption } from './constants/config';
import { NeonInvoker, NeonParser } from '@cityofzion/neon-dappkit';
import { Utils } from './helpers';
const DEFAULT_OPTIONS = {
    node: NetworkOption.MainNet,
    scriptHash: '0x0e312c70ce6ed18d5702c6c5794c493d9ef46dc9',
    parser: NeonParser,
    account: undefined,
};
/**
 * The Collection prop is designed to store static-immutable data for reference in other projects. Storing static data
 * in contracts is very expensive and inefficient, especially for new projects.  This contract resolves that issue by creating
 * library for static data. This class exposes the interface along with a number of helpful features to make the smart
 * contract easy to use for typescript developers.
 *
 * All of the prop helper classes will auto-configure your network settings.  The default configuration will interface with
 * the contract on MainNet, but this can be configured by providing configuration options.
 *
 * To use this class:
 * ```typescript
 * import { Collection } from "../../dist" //import { Collection } from "@cityofzion/props-collection
 *
 * const collection: Collection = new Collection()
 * const total = await collection.totalCollections()
 * console.log(total) // outputs the total collection count in the contract
 * ```
 */
export class Generator {
    constructor(configOptions = {}) {
        this.initialized = 'invoker' in configOptions;
        this.config = { ...DEFAULT_OPTIONS, ...configOptions };
    }
    /**
     * DO NOT EDIT ME
     * The contract script hash that is being interfaced with.
     */
    get scriptHash() {
        if (this.config.scriptHash) {
            return this.config.scriptHash;
        }
        throw new Error('no scripthash defined');
    }
    get node() {
        if (this.config.node) {
            return new rpc.RPCClient(this.config.node);
        }
        throw new Error('no node selected!');
    }
    async init() {
        if (!this.initialized) {
            this.config.invoker = await NeonInvoker.init({
                rpcAddress: this.config.node,
                account: this.config.account,
            });
            this.initialized = true;
        }
        return true;
    }
    /// ///////////////////////////////////////////////////
    /// ///////////////////////////////////////////////////
    /// /////////////CONTRACT METHODS//////////////////////
    /// ///////////////////////////////////////////////////
    /// ///////////////////////////////////////////////////
    async createGenerator(params) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [GeneratorAPI.createGenerator(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async buildGenerator(params) {
        await this.init();
        let txid = await this.createGenerator({
            label: params.generator.label,
            baseGeneratorFee: params.generator.baseGeneratorFee,
        });
        const res = await Utils.transactionCompletion(txid);
        const generatorId = res.parsedStack[0];
        const txids = [];
        for await (const trait of params.generator.traits) {
            txid = await this.createTrait({
                generatorId,
                trait,
            });
            txids.push(txid);
        }
        return txids;
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
    async createTrait(params) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [GeneratorAPI.createTrait(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async getGeneratorJSON(params) {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [GeneratorAPI.getGeneratorJSON(this.config.scriptHash, params)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
    async getGeneratorInstanceJSON(params) {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [GeneratorAPI.getGeneratorInstanceJSON(this.config.scriptHash, params)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
    async createInstance(params) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [GeneratorAPI.createInstance(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async mintFromInstance(params) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [GeneratorAPI.mintFromInstance(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async setInstanceAccessMode(params) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [GeneratorAPI.setInstanceAccessMode(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async setInstanceAuthorizedUsers(params) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [GeneratorAPI.setInstanceAuthorizedUsers(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async setInstanceAuthorizedContracts(params) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [GeneratorAPI.setInstanceAuthorizedContracts(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async setInstanceFee(params) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [GeneratorAPI.setInstanceFee(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async totalGenerators() {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [GeneratorAPI.totalGenerators(this.config.scriptHash)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
    async totalGeneratorInstances() {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [GeneratorAPI.totalGeneratorInstances(this.config.scriptHash)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
}
//# sourceMappingURL=Generator.js.map