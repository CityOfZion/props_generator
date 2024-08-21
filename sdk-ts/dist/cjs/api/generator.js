"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorAPI = void 0;
const types_1 = require("../types");
const neon_js_1 = require("@cityofzion/neon-js");
class GeneratorAPI {
    static createGenerator(scriptHash, params) {
        return {
            scriptHash,
            operation: 'create_generator',
            args: [
                { type: 'String', value: params.label },
                { type: 'Integer', value: params.baseGeneratorFee.toString() },
            ],
        };
    }
    static createInstance(scriptHash, params) {
        return {
            scriptHash,
            operation: 'create_instance',
            args: [{ type: 'Integer', value: params.generatorId.toString() }],
        };
    }
    static createTrait(scriptHash, params) {
        const formattedLevels = params.trait.traitLevels.map(traitLevel => {
            const traitPointers = traitLevel.traits.map(trait => {
                const formattedPointers = {
                    type: 'Array',
                    value: [
                        { type: 'Integer', value: trait.type.toString() },
                        { type: 'Integer', value: trait.maxMint.toString() },
                    ],
                };
                switch (trait.type) {
                    case types_1.EventTypeEnum.CollectionPointer:
                        formattedPointers.value.push({
                            type: 'Array',
                            value: [
                                { type: 'Integer', value: trait.args.collectionId.toString() },
                                { type: 'Integer', value: trait.args.index.toString() },
                            ],
                        });
                        break;
                    case types_1.EventTypeEnum.InstanceCall:
                        formattedPointers.value.push({
                            type: 'Array',
                            value: [
                                { type: 'Hash160', value: trait.args.scriptHash },
                                { type: 'String', value: trait.args.method },
                                { type: 'Array', value: trait.args.param },
                            ],
                        });
                        break;
                    case types_1.EventTypeEnum.Value:
                        // @ts-ignore
                        formattedPointers.value.push(trait.args);
                        break;
                    case types_1.EventTypeEnum.CollectionSampleFrom:
                        formattedPointers.value.push({
                            type: 'Array',
                            value: [{ type: 'Integer', value: trait.args.collectionId.toString() }],
                        });
                        break;
                    default:
                        throw new Error('unrecognized trail event type');
                }
                return formattedPointers;
            });
            return {
                type: 'Array',
                value: [
                    { type: 'Integer', value: traitLevel.dropScore.toString() },
                    { type: 'Integer', value: traitLevel.mintMode.toString() },
                    { type: 'Array', value: traitPointers },
                ],
            };
        });
        // TODO: fix generator ID format on contract update
        return {
            scriptHash,
            operation: 'create_trait',
            args: [
                { type: 'String', value: neon_js_1.u.hexstring2str(neon_js_1.u.reverseHex(neon_js_1.u.num2hexstring(params.generatorId))) },
                { type: 'String', value: params.trait.label },
                { type: 'Integer', value: params.trait.slots.toString() },
                { type: 'Array', value: formattedLevels },
            ],
        };
    }
    static getGeneratorJSON(scriptHash, params) {
        return {
            scriptHash,
            operation: 'get_generator_json',
            args: [{ type: 'Integer', value: params.generatorId.toString() }],
        };
    }
    static getTraitJSON(scriptHash, params) {
        return {
            scriptHash,
            operation: 'get_trait_json',
            args: [{ type: 'Integer', value: params.traitId.toString() }],
        };
    }
    static getGeneratorInstanceJSON(scriptHash, params) {
        return {
            scriptHash,
            operation: 'get_generator_instance_json',
            args: [{ type: 'Integer', value: params.instanceId.toString() }],
        };
    }
    static mintFromInstance(scriptHash, params) {
        return {
            scriptHash,
            operation: 'mint_from_instance',
            args: [
                { type: 'String', value: '' },
                { type: 'Integer', value: params.instanceId.toString() },
            ],
        };
    }
    static setInstanceAccessMode(scriptHash, params) {
        return {
            scriptHash,
            operation: 'set_instance_access_mode',
            args: [
                { type: 'Integer', value: params.instanceId.toString() },
                { type: 'Integer', value: params.accessMode.toString() },
            ],
        };
    }
    static setInstanceAuthorizedUsers(scriptHash, params) {
        return {
            scriptHash,
            operation: 'set_instance_authorized_users',
            args: [
                { type: 'Integer', value: params.instanceId.toString() },
                {
                    type: 'Array',
                    value: params.users.map(user => ({
                        type: 'Hash160',
                        value: user,
                    })),
                },
            ],
        };
    }
    static setInstanceAuthorizedContracts(scriptHash, params) {
        return {
            scriptHash,
            operation: 'set_instance_authorized_contracts',
            args: [
                { type: 'Integer', value: params.instanceId.toString() },
                {
                    type: 'Array',
                    value: params.contracts.map(contract => {
                        return {
                            type: 'Array',
                            value: [
                                { type: 'Hash160', value: contract.scriptHash },
                                { type: 'Integer', value: contract.code.toString() },
                            ],
                        };
                    }),
                },
            ],
        };
    }
    static setInstanceFee(scriptHash, params) {
        return {
            scriptHash,
            operation: 'set_instance_fee',
            args: [
                { type: 'Integer', value: params.instanceId.toString() },
                { type: 'Integer', value: params.fee.toString() },
            ],
        };
    }
    static totalGenerators(scriptHash) {
        return {
            scriptHash,
            operation: 'total_generators',
            args: [],
        };
    }
    static totalGeneratorInstances(scriptHash) {
        return {
            scriptHash,
            operation: 'total_generator_instances',
            args: [],
        };
    }
    static update(scriptHash, params) {
        return {
            scriptHash,
            operation: 'update',
            args: [
                { type: 'ByteArray', value: params.script },
                { type: 'String', value: params.manifest },
                { type: 'Any', value: params.data },
            ],
        };
    }
}
exports.GeneratorAPI = GeneratorAPI;
//# sourceMappingURL=generator.js.map