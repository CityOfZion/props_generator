import { ConstructorOptions, GeneratorInstanceType, GeneratorType, CreateGenerator, CreateTrait, GetGeneratorInstanceJSON, SetInstanceAccessMode, SetInstanceAuthorizedUsers, SetInstanceAuthorizedContracts, SetInstanceFee } from './types';
import { rpc } from '@cityofzion/neon-core';
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
}
