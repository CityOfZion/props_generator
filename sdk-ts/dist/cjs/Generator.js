"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const api_1 = require("./api");
const neon_core_1 = require("@cityofzion/neon-core");
const config_1 = require("./constants/config");
const neon_dappkit_1 = require("@cityofzion/neon-dappkit");
const helpers_1 = require("./helpers");
const DEFAULT_OPTIONS = {
    node: config_1.NetworkOption.MainNet,
    scriptHash: '0x0e312c70ce6ed18d5702c6c5794c493d9ef46dc9',
    parser: neon_dappkit_1.NeonParser,
    account: undefined,
};
class Generator {
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
            return new neon_core_1.rpc.RPCClient(this.config.node);
        }
        throw new Error('no node selected!');
    }
    async init() {
        if (!this.initialized) {
            this.config.invoker = await neon_dappkit_1.NeonInvoker.init({
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
            invocations: [api_1.GeneratorAPI.createGenerator(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async buildGenerator(params) {
        await this.init();
        const txids = [];
        let txid = await this.createGenerator({
            label: params.generator.label,
            baseGeneratorFee: params.generator.baseGeneratorFee,
        });
        txids.push(txid);
        const res = await helpers_1.Utils.transactionCompletion(txid, {
            node: this.node.url,
        });
        const generatorId = res.parsedStack[0];
        const traitInvocations = [];
        for (let i = 0; i < params.generator.traits.length; i++) {
            const invoke = api_1.GeneratorAPI.createTrait(this.config.scriptHash, {
                generatorId,
                trait: params.generator.traits[i],
            });
            traitInvocations.push(invoke);
        }
        txid = await this.config.invoker.invokeFunction({
            invocations: traitInvocations,
            signers: [],
        });
        txids.push(txid);
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
            invocations: [api_1.GeneratorAPI.createTrait(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async getGeneratorJSON(params) {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [api_1.GeneratorAPI.getGeneratorJSON(this.config.scriptHash, params)],
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
            invocations: [api_1.GeneratorAPI.getGeneratorInstanceJSON(this.config.scriptHash, params)],
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
            invocations: [api_1.GeneratorAPI.createInstance(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async mintFromInstance(params) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [api_1.GeneratorAPI.mintFromInstance(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async setInstanceAccessMode(params) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [api_1.GeneratorAPI.setInstanceAccessMode(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async setInstanceAuthorizedUsers(params) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [api_1.GeneratorAPI.setInstanceAuthorizedUsers(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async setInstanceAuthorizedContracts(params) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [api_1.GeneratorAPI.setInstanceAuthorizedContracts(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async setInstanceFee(params) {
        await this.init();
        return await this.config.invoker.invokeFunction({
            invocations: [api_1.GeneratorAPI.setInstanceFee(this.config.scriptHash, params)],
            signers: [],
        });
    }
    async totalGenerators() {
        await this.init();
        const res = await this.config.invoker.testInvoke({
            invocations: [api_1.GeneratorAPI.totalGenerators(this.config.scriptHash)],
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
            invocations: [api_1.GeneratorAPI.totalGeneratorInstances(this.config.scriptHash)],
            signers: [],
        });
        if (res.stack.length === 0) {
            throw new Error(res.exception ?? 'unrecognized response');
        }
        return this.config.parser.parseRpcResponse(res.stack[0]);
    }
    async testFee(params) {
        await this.init();
        let txid = await this.createInstance({
            generatorId: params.generatorId,
        });
        let res = await helpers_1.Utils.transactionCompletion(txid, {
            node: this.config.node,
        });
        const instanceId = res.parsedStack[0];
        txid = await this.setInstanceAuthorizedContracts({
            instanceId: 24,
            contracts: [
                {
                    scriptHash: '0x0e312c70ce6ed18d5702c6c5794c493d9ef46dc9',
                    code: instanceId,
                },
            ],
        });
        res = await helpers_1.Utils.transactionCompletion(txid, {
            node: this.config.node,
        });
        txid = await this.setInstanceFee({
            instanceId,
            fee: params.fee,
        });
        res = await helpers_1.Utils.transactionCompletion(txid, {
            node: this.config.node,
        });
        console.log('  set instance fee: ', instanceId, res.parsedStack[0]);
        try {
            // mint using the fee
            const txids = [];
            for (let i = 0; i < params.count; i++) {
                const txid = await this.mintFromInstance({
                    instanceId,
                });
                txids.push(txid);
            }
            for (let i = 0; i < txids.length; i++) {
                await helpers_1.Utils.transactionCompletion(txid, {
                    node: this.config.node,
                });
            }
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    async optimizeFee(params) {
        await this.init();
        // assert that the account is the owner of the generator
        const feeRange = params.feeRange ? params.feeRange : [0, 10 ** 8];
        const count = params.count ? params.count : 1500;
        let fee;
        let res;
        while (1) {
            fee = (feeRange[0] + feeRange[1]) / 2;
            console.log(`running ${fee / 10 ** 8} GAS`);
            res = await this.testFee({
                generatorId: params.generatorId,
                fee,
                count,
            });
            console.log(`  ${res}`);
            if (!res) {
                feeRange[0] = fee;
            }
            else {
                feeRange[1] = fee;
            }
            if (feeRange[1] - feeRange[0] < 0.001 * 10 ** 8) {
                console.log(`Optimized generator fee: ${feeRange[1]} | ${feeRange[1] / 10 ** 8} GAS`);
                return;
            }
        }
    }
}
exports.Generator = Generator;
//# sourceMappingURL=Generator.js.map