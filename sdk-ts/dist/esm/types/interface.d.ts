import { wallet, rpc } from '@cityofzion/neon-core';
import { Arg } from '@cityofzion/neon-dappkit-types';
import { NeonInvoker, NeonParser } from '@cityofzion/neon-dappkit';
export interface ConstructorOptions {
    node?: string;
    scriptHash?: string;
    invoker?: NeonInvoker;
    parser?: typeof NeonParser;
    account?: wallet.Account | undefined;
}
export declare type PollingOption = {
    period?: number;
    timeout?: number;
    node?: string;
};
export declare type ParsedLog = {
    log: rpc.ApplicationLogJson;
    parsedStack: any;
    parsedNotifications: any;
    parsedGASConsumption: any;
};
export declare enum EventTypeEnum {
    CollectionPointer = 0,
    InstanceCall = 1,
    Value = 2,
    CollectionSampleFrom = 3
}
export declare enum InstanceAccessMode {
    ContractWhitelist = 0,
    ContractWhiteListRestricted = 1,
    Global = 2
}
export interface EventCollectionPointer {
    collectionId: number;
    index: number;
}
export interface EventCollectionSampleFrom {
    collectionId: number;
}
export interface EventInstanceCall {
    scriptHash: string;
    method: string;
    param: Arg[];
}
export interface EventValue {
    value: string;
}
export interface EventTypeWrapper {
    type: EventTypeEnum;
    maxMint: number;
    args: EventCollectionPointer | EventInstanceCall | EventValue | EventCollectionSampleFrom;
}
export interface TraitLevel {
    dropScore: number;
    mintMode: number;
    traits: EventTypeWrapper[];
}
export interface TraitType {
    label: string;
    slots: number;
    traitLevels: TraitLevel[];
}
export interface GeneratorType {
    id?: number;
    author?: string;
    label: string;
    baseGeneratorFee: number;
    traits: TraitType[];
}
export interface InstanceAuthorizedContract {
    scriptHash: string;
    code: number;
}
export interface GeneratorInstanceType {
    res: any;
}
