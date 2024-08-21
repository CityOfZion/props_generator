import { wallet, rpc } from '@cityofzion/neon-core'
import { NeonInvoker, NeonParser } from '@cityofzion/neon-dappkit'

export interface ConstructorOptions {
  node?: string
  scriptHash?: string
  invoker?: NeonInvoker
  parser?: typeof NeonParser
  account?: wallet.Account | undefined
}

export type PollingOption = {
  period?: number
  timeout?: number
  node?: string
}

export type ParsedLog = {
  log: rpc.ApplicationLogJson
  parsedStack: any
  parsedNotifications: any
  parsedGASConsumption: any
}

export enum EventTypeEnum {
  CollectionPointer = 0,
  InstanceCall = 1,
  Value = 2,
  CollectionSampleFrom = 3,
}

export enum InstanceAccessMode {
  ContractWhitelist = 0,
  ContractWhiteListRestricted = 1,
  Global = 2,
}

export interface EventCollectionPointer {
  collectionId: number
  index: number
}

export interface EventCollectionSampleFrom {
  collectionId: number
}

export interface EventInstanceCall {
  scriptHash: string
  method: string
  param: any[]
}

export type EventValue = { type: string; value: any }

export interface EventTypeWrapper {
  type: EventTypeEnum
  maxMint: number
  args: EventCollectionPointer | EventInstanceCall | EventValue | EventCollectionSampleFrom
}

export interface TraitLevel {
  dropScore: number
  mintMode: number
  traits: EventTypeWrapper[]
}

export interface TraitType {
  label: string
  slots: number
  traitLevels: TraitLevel[]
}

export interface GeneratorType {
  id?: number
  author?: string
  label: string
  baseGeneratorFee: number
  traits: TraitType[]
}

export interface InstanceAuthorizedContract {
  scriptHash: string
  code: number
}

export interface GeneratorInstanceType {
  res: any
}
