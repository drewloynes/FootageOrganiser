import { RuleType, Rule } from '@shared/rules/rule'
import { StoreRulePath } from './storeRulePath'
import { TypeCopyFileOptions } from '@shared/rules/typeCopyFileOptions'
import { TypeMirrorOptions } from '@shared/rules/typeMirrorOptions'
import { RuleCopyOptions } from '@shared/rules/ruleCopyOptions'
import { RulePath } from '@shared/rules/rulePath'

const fileName = 'storeRule.ts'
const area = 'store rules'

// Class for storing Rule objects to disk
export class StoreRule {
  name: string
  type: RuleType
  typeOptions: TypeCopyFileOptions | TypeMirrorOptions
  copyOptions: RuleCopyOptions
  from: StoreRulePath
  to: StoreRulePath

  /* --- Constructor & Getters / Setters --- */

  constructor(rule: Rule) {
    const funcName = 'StoreRule Constructor'
    entryLog(funcName, fileName, area)

    this.name = rule.getName()
    this.type = rule.getType()
    this.typeOptions = rule.getTypeOptions()
    this.copyOptions = rule.getCopyOptions()
    const from = rule.getFrom()
    const to = rule.getTo()
    this.from = new StoreRulePath(from.getVolumeName(), from.getVolumeRootPath())
    this.to = new StoreRulePath(to.getVolumeName(), to.getVolumeRootPath())

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
    if (data.typeOptions === undefined) {
      throw 'Cant find rule.typeOptions'
    }
    if (data.copyOptions === undefined) {
      throw 'Cant find rule.copyOptions'
    }
    if (data.from === undefined) {
      throw 'Cant find rule.from'
    }
    if (data.from.volumeName === undefined) {
      throw 'Cant find from.volumeName'
    }
    if (data.from.volumeRootPath === undefined) {
      throw 'Cant find from.volumeRootPath'
    }
    if (data.to === undefined) {
      throw 'Cant find rule.to'
    }
    if (data.to.volumeName === undefined) {
      throw 'Cant find to.volumeName'
    }
    if (data.to.volumeRootPath === undefined) {
      throw 'Cant find to.volumeRootPath'
    }

    let typeOptions: TypeCopyFileOptions | TypeMirrorOptions
    if (data.type === RuleType.COPYFILE) {
      condLog('Create each Rule object', funcName, fileName, area)
      if (data.typeOptions.copyFormat === undefined) {
        throw 'Cant find typeCopyFileOptions.copyFormat'
      }
      if (data.typeOptions.customName === undefined) {
        throw 'Cant find typeCopyFileOptions.customName'
      }
      if (data.typeOptions.autoCleanFromPath === undefined) {
        throw 'Cant find typeCopyFileOptions.autoCleanFromPath'
      }
      if (data.typeOptions.deleteExtra === undefined) {
        throw 'Cant find typeCopyFileOptions.deleteExtra'
      }
      if (data.typeOptions.extraDeletePaths === undefined) {
        throw 'Cant find typeCopyFileOptions.extraDeletePaths'
      }
      // TODO valdiate the paths!
      const typedExtraDeletePaths: RulePath[] = []
      for (const extraDeletePath of data.typeOptions.extraDeletePaths) {
        condLog('For an extraDeletePath', funcName, fileName, area)
        typedExtraDeletePaths.push(
          new RulePath(
            extraDeletePath.volumeName,
            extraDeletePath.volumeRootPath,
            extraDeletePath.filesToInclude,
            extraDeletePath.filesToExclude,
            extraDeletePath.dirsToInclude,
            extraDeletePath.dirsToExclude
          )
        )
      }
      typeOptions = new TypeCopyFileOptions(
        data.typeOptions.copyFormat,
        data.typeOptions.customName,
        data.typeOptions.autoCleanFromPath,
        data.typeOptions.deleteExtra,
        typedExtraDeletePaths
      )
    } else if (data.type === RuleType.MIRROR) {
      condLog('Create each Rule object', funcName, fileName, area)
      if (data.typeOptions.deleteExtrasInTo === undefined) {
        throw 'Cant find typeMirrorOptions.deleteExtrasInTo'
      }
      typeOptions = new TypeMirrorOptions(
        data.typeOptions.deleteExtrasInTo,
        data.typeOptions.deleteInclude,
        data.typeOptions.deleteExclude,
        data.typeOptions.dirDeleteInclude,
        data.typeOptions.dirDeleteExclude
      )
    } else {
      throw 'Unknown rule type'
    }
    const copyOptions: RuleCopyOptions = new RuleCopyOptions(
      data.copyOptions.copyInclude,
      data.copyOptions.copyExclude,
      data.copyOptions.dirCopyExclude,
      data.copyOptions.dirCopyExclude
    )
    const from = new RulePath(data.from.volumeName, data.from.volumeRootPath)
    const to = new RulePath(data.to.volumeName, data.to.volumeRootPath)

    const rule = new Rule(data.name, data.type, typeOptions, copyOptions, from, to)

    exitLog(funcName, fileName, area)
    return rule
  }
}
