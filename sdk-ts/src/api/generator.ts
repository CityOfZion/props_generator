import {
  CreateGenerator,
  CreateTrait,
  GetGeneratorInstanceJSON,
  SetInstanceAccessMode,
  SetInstanceAuthorizedUsers,
  SetInstanceAuthorizedContracts,
  SetInstanceFee,
  Update,
  EventCollectionPointer,
  EventCollectionSampleFrom,
  EventInstanceCall,
  EventTypeEnum,
  EventValue,
} from '../types'
import { Arg, ContractInvocation } from '@cityofzion/neon-dappkit-types'

export class GeneratorAPI {
  static createGenerator(scriptHash: string, params: CreateGenerator): ContractInvocation {
    return {
      scriptHash,
      operation: 'create_generator',
      args: [
        { type: 'String', value: params.label },
        { type: 'Integer', value: params.baseGeneratorFee.toString() },
      ],
    }
  }

  static createInstance(scriptHash: string, params: { generatorId: number }): ContractInvocation {
    return {
      scriptHash,
      operation: 'create_instance',
      args: [{ type: 'Integer', value: params.generatorId.toString() }],
    }
  }

  static createTrait(scriptHash: string, params: CreateTrait): ContractInvocation {
    const formattedLevels: Arg[] = params.trait.traitLevels.map(traitLevel => {
      const traitPointers = traitLevel.traits.map(trait => {
        const formattedPointers: Arg = {
          type: 'Array',
          value: [
            { type: 'Integer', value: trait.type.toString() },
            { type: 'Integer', value: trait.maxMint.toString() },
          ],
        }

        switch (trait.type) {
          case EventTypeEnum.CollectionPointer:
            formattedPointers.value.push({
              type: 'Array',
              value: [
                { type: 'Integer', value: (trait.args as EventCollectionPointer).collectionId.toString() },
                { type: 'Integer', value: (trait.args as EventCollectionPointer).index.toString() },
              ],
            })
            break

          case EventTypeEnum.InstanceCall:
            formattedPointers.value.push({
              type: 'Array',
              value: [
                { type: 'Hash160', value: (trait.args as EventInstanceCall).scriptHash },
                { type: 'String', value: (trait.args as EventInstanceCall).method },
                { type: 'Array', value: (trait.args as EventInstanceCall).param },
              ],
            })
            break

          case EventTypeEnum.Value:
            formattedPointers.value.push({
              type: 'Array',
              value: [{ type: 'ByteArray', value: (trait.args as EventValue).value }],
            })
            break

          case EventTypeEnum.CollectionSampleFrom:
            formattedPointers.value.push({
              type: 'Array',
              value: [{ type: 'Integer', value: (trait.args as EventCollectionSampleFrom).collectionId.toString() }],
            })
            break

          default:
            throw new Error('unrecognized trail event type')
        }
        return formattedPointers
      })
      return {
        type: 'Array',
        value: [
          { type: 'Integer', value: traitLevel.dropScore.toString() },
          { type: 'Integer', value: traitLevel.mintMode.toString() },
          { type: 'Array', value: traitPointers },
        ],
      }
    })

    return {
      scriptHash,
      operation: 'create_trait',
      args: [
        { type: 'Integer', value: params.generatorId.toString() },
        { type: 'String', value: params.trait.label },
        { type: 'Integer', value: params.trait.slots.toString() },
        { type: 'Array', value: formattedLevels },
      ],
    }
  }

  static getGeneratorJSON(scriptHash: string, params: { generatorId: number }): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_generator_json',
      args: [{ type: 'Integer', value: params.generatorId.toString() }],
    }
  }

  static getTraitJSON(scriptHash: string, params: { traitId: number }): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_trait_json',
      args: [{ type: 'Integer', value: params.traitId.toString() }],
    }
  }

  static getGeneratorInstanceJSON(scriptHash: string, params: GetGeneratorInstanceJSON): ContractInvocation {
    return {
      scriptHash,
      operation: 'get_generator_instance_json',
      args: [{ type: 'Integer', value: params.instanceId.toString() }],
    }
  }

  static mintFromInstance(scriptHash: string, params: { instanceId: number }): ContractInvocation {
    return {
      scriptHash,
      operation: 'mint_from_instance',
      args: [
        { type: 'String', value: '' },
        { type: 'Integer', value: params.instanceId.toString() },
      ],
    }
  }

  static setInstanceAccessMode(scriptHash: string, params: SetInstanceAccessMode): ContractInvocation {
    return {
      scriptHash,
      operation: 'set_instance_access_mode',
      args: [
        { type: 'Integer', value: params.instanceId.toString() },
        { type: 'Integer', value: params.accessMode.toString() },
      ],
    }
  }

  static setInstanceAuthorizedUsers(scriptHash: string, params: SetInstanceAuthorizedUsers): ContractInvocation {
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
    }
  }

  static setInstanceAuthorizedContracts(
    scriptHash: string,
    params: SetInstanceAuthorizedContracts
  ): ContractInvocation {
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
            }
          }),
        },
      ],
    }
  }

  static setInstanceFee(scriptHash: string, params: SetInstanceFee): ContractInvocation {
    return {
      scriptHash,
      operation: 'set_instance_fee',
      args: [
        { type: 'Integer', value: params.instanceId.toString() },
        { type: 'Integer', value: params.fee.toString() },
      ],
    }
  }

  static totalGenerators(scriptHash: string): ContractInvocation {
    return {
      scriptHash,
      operation: 'total_generators',
      args: [],
    }
  }

  static totalGeneratorInstances(scriptHash: string): ContractInvocation {
    return {
      scriptHash,
      operation: 'total_generator_instances',
      args: [],
    }
  }

  static update(scriptHash: string, params: Update): ContractInvocation {
    return {
      scriptHash,
      operation: 'update',
      args: [
        { type: 'ByteArray', value: params.script },
        { type: 'String', value: params.manifest },
        { type: 'Any', value: params.data },
      ],
    }
  }
}
