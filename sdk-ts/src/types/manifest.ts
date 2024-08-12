import { InstanceAccessMode, InstanceAuthorizedContract, TraitType } from './interface'

export interface CreateGenerator {
  label: string
  baseGeneratorFee: number
}
export interface CreateTrait {
  generatorId: number
  trait: TraitType
}
export interface GetGeneratorInstanceJSON {
  instanceId: number
}
export interface SetInstanceAccessMode {
  instanceId: number
  accessMode: InstanceAccessMode
}
export interface SetInstanceAuthorizedUsers {
  instanceId: number
  users: string[]
}
export interface SetInstanceAuthorizedContracts {
  instanceId: number
  contracts: InstanceAuthorizedContract[]
}
export interface SetInstanceFee {
  instanceId: number
  fee: number
}

export interface Update {
  script: string
  manifest: string
  data: any
}
