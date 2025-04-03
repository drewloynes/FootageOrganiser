import { RuleType, Rule } from '@shared/rules/rule'
import { StoreRulePath } from './storeRulePath'
import { TypeCopyFileOptions } from '@shared/rules/typeCopyFileOptions'
import { TypeMirrorOptions } from '@shared/rules/typeMirrorOptions'
import { StoreTypeCopyFileOptions } from './storeCopyFileOptions'

const fileName = 'storeRule.ts'
const area = 'store rules'

// Class for storing Rule objects to disk
// Storing only neccessary values
export class StoreRule {
  name: string
  type: RuleType
  from: StoreRulePath
  to: StoreRulePath
  typeOptions: StoreTypeCopyFileOptions | TypeMirrorOptions
  stopAfterProcessing: boolean
  pauseProcessing: boolean

  /* --- Constructor & Getters / Setters --- */

  constructor(rule: Rule) {
    const funcName = 'StoreRule Constructor'
    entryLog(funcName, fileName, area)

    this.name = rule.getName()
    this.type = rule.getType()
    this.from = new StoreRulePath(rule.getFrom())
    this.to = new StoreRulePath(rule.getTo())
    if (this.type === RuleType.COPYFILE) {
      this.typeOptions = new StoreTypeCopyFileOptions(<TypeCopyFileOptions>rule.getTypeOptions())
    } else {
      this.typeOptions = <TypeMirrorOptions>rule.getTypeOptions()
    }
    this.stopAfterProcessing = rule.getStopAfterProcessing()
    this.pauseProcessing = rule.getPauseProcessing()

    exitLog(funcName, fileName, area)
    return
  }

  /* --- Functions --- */

  // Converts StoreRule object into a Rule object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toRule(data: any): Rule {
    const funcName = 'toRule'
    entryLog(funcName, fileName, area)

    if (data.name === undefined) {
      throw 'Cant find rule.name'
    }
    if (data.type === undefined) {
      throw 'Cant find rule.type'
    }
    if (data.from === undefined) {
      throw 'Cant find rule.from'
    }
    if (data.to === undefined) {
      throw 'Cant find rule.to'
    }
    if (data.typeOptions === undefined) {
      throw 'Cant find rule.typeOptions'
    }
    if (data.stopAfterProcessing === undefined) {
      throw 'Cant find rule.stopAfterProcessing'
    }
    if (data.pauseProcessing === undefined) {
      throw 'Cant find rule.pauseProcessing'
    }

    // TODO: data validation

    let typeOptions: TypeCopyFileOptions | TypeMirrorOptions
    if (data.type === RuleType.COPYFILE) {
      condLog('Rule type: Copy File', funcName, fileName, area)
      typeOptions = StoreTypeCopyFileOptions.toTypeCopyFileOptions(data.typeOptions)
    } else if (data.type === RuleType.MIRROR) {
      condLog('Rule type: Mirror', funcName, fileName, area)
      if (data.typeOptions.deleteExtrasInTo === undefined) {
        throw 'Cant find typeMirrorOptions.deleteExtrasInTo'
      }
      typeOptions = new TypeMirrorOptions(data.typeOptions.deleteExtrasInTo)
    } else {
      throw 'Unknown rule type'
    }

    const from = StoreRulePath.toRulePath(data.from)
    const to = StoreRulePath.toRulePath(data.to)

    const rule = new Rule(
      data.name,
      data.type,
      from,
      to,
      typeOptions,
      data.stopAfterProcessing,
      data.pauseProcessing
    )

    exitLog(funcName, fileName, area)
    return rule
  }
}
