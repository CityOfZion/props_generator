import { CreateGenerator, CreateTrait, GetGeneratorInstanceJSON, SetInstanceAccessMode, SetInstanceAuthorizedUsers, SetInstanceAuthorizedContracts, SetInstanceFee, Update } from '../types';
import { ContractInvocation } from '@cityofzion/neon-dappkit-types';
export declare class GeneratorAPI {
    static createGenerator(scriptHash: string, params: CreateGenerator): ContractInvocation;
    static createInstance(scriptHash: string, params: {
        generatorId: number;
    }): ContractInvocation;
    static createTrait(scriptHash: string, params: CreateTrait): ContractInvocation;
    static getGeneratorJSON(scriptHash: string, params: {
        generatorId: number;
    }): ContractInvocation;
    static getTraitJSON(scriptHash: string, params: {
        traitId: number;
    }): ContractInvocation;
    static getGeneratorInstanceJSON(scriptHash: string, params: GetGeneratorInstanceJSON): ContractInvocation;
    static mintFromInstance(scriptHash: string, params: {
        instanceId: number;
    }): ContractInvocation;
    static setInstanceAccessMode(scriptHash: string, params: SetInstanceAccessMode): ContractInvocation;
    static setInstanceAuthorizedUsers(scriptHash: string, params: SetInstanceAuthorizedUsers): ContractInvocation;
    static setInstanceAuthorizedContracts(scriptHash: string, params: SetInstanceAuthorizedContracts): ContractInvocation;
    static setInstanceFee(scriptHash: string, params: SetInstanceFee): ContractInvocation;
    static totalGenerators(scriptHash: string): ContractInvocation;
    static totalGeneratorInstances(scriptHash: string): ContractInvocation;
    static update(scriptHash: string, params: Update): ContractInvocation;
}
