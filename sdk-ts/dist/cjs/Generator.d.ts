import { ConstructorOptions, GeneratorInstanceType, GeneratorType, CreateGenerator, CreateTrait, GetGeneratorInstanceJSON, SetInstanceAccessMode, SetInstanceAuthorizedUsers, SetInstanceAuthorizedContracts, SetInstanceFee } from './types';
import { rpc } from '@cityofzion/neon-core';
export declare class Generator {
    private config;
    private initialized;
    constructor(configOptions?: ConstructorOptions);
    /**
     * DO NOT EDIT ME
     * The contract script hash that is being interfaced with.
     */
    get scriptHash(): string;
    get node(): rpc.RPCClient;
    init(): Promise<boolean>;
    createGenerator(params: CreateGenerator): Promise<string>;
    buildGenerator(params: {
        generator: GeneratorType;
    }): Promise<string[]>;
    createTrait(params: CreateTrait): Promise<string>;
    getGeneratorJSON(params: {
        generatorId: number;
    }): Promise<GeneratorType>;
    getGeneratorInstanceJSON(params: GetGeneratorInstanceJSON): Promise<GeneratorInstanceType>;
    createInstance(params: {
        generatorId: number;
    }): Promise<string>;
    mintFromInstance(params: {
        instanceId: number;
    }): Promise<string>;
    setInstanceAccessMode(params: SetInstanceAccessMode): Promise<string>;
    setInstanceAuthorizedUsers(params: SetInstanceAuthorizedUsers): Promise<string>;
    setInstanceAuthorizedContracts(params: SetInstanceAuthorizedContracts): Promise<string>;
    setInstanceFee(params: SetInstanceFee): Promise<string>;
    totalGenerators(): Promise<number>;
    totalGeneratorInstances(): Promise<number>;
    testFee(params: {
        generatorId: number;
        fee: number;
        count: number;
    }): Promise<boolean>;
    optimizeFee(params: {
        generatorId: number;
        feeRange?: number[];
        count?: number;
    }): Promise<void>;
}
