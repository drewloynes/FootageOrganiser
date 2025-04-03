import { TypeCopyFileFormatOptions, TypeCopyFileOptions } from '@shared/rules/typeCopyFileOptions'
import { StoreRulePath } from './storeRulePath'
import { RulePath } from '@shared/rules/rulePath'

const fileName = 'storeCopyFileOptions.ts'
const area = 'store-rules'

export class StoreTypeCopyFileOptions {
  copyFormat: TypeCopyFileFormatOptions[]
  customName: string
  autoCleanFromPath: boolean
  deleteExtra: boolean
  extraDeletePaths: StoreRulePath[]

  constructor(copyFileOptions: TypeCopyFileOptions) {
    const funcName = 'StoreTypeCopyFileOptions Constructor'
    entryLog(funcName, fileName, area)

    this.copyFormat = copyFileOptions.getCopyFortmat()
    this.customName = copyFileOptions.getCustomName()
    this.autoCleanFromPath = copyFileOptions.getAutoCleanFromPath()
    this.deleteExtra = copyFileOptions.getDeleteExtra()
    this.extraDeletePaths = []
    const extraPaths = copyFileOptions.getExtraDeletePaths()
    for (const extraPath of extraPaths) {
      this.extraDeletePaths.push(new StoreRulePath(extraPath))
    }

    exitLog(funcName, fileName, area)
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toTypeCopyFileOptions(data: any): TypeCopyFileOptions {
    const funcName = 'toRulePath'
    entryLog(funcName, fileName, area)

    if (data.copyFormat === undefined) {
      throw 'Cant find copyFileOptions.copyFormat'
    }
    if (data.customName === undefined) {
      throw 'Cant find copyFileOptions.customName'
    }
    if (data.autoCleanFromPath === undefined) {
      throw 'Cant find copyFileOptions.autoCleanFromPath'
    }
    if (data.deleteExtra === undefined) {
      throw 'Cant find copyFileOptions.deleteExtra'
    }
    if (data.extraDeletePaths === undefined) {
      throw 'Cant find copyFileOptions.extraDeletePaths'
    }
    // TODO: Data validation
    const extraDeletePaths: RulePath[] = []
    for (const storeRulePath of data.extraDeletePaths) {
      extraDeletePaths.push(StoreRulePath.toRulePath(storeRulePath))
    }
    const copyFileOptions = new TypeCopyFileOptions(
      data.copyFormat,
      data.customName,
      data.autoCleanFromPath,
      data.deleteExtra,
      extraDeletePaths
    )

    exitLog(funcName, fileName, area)
    return copyFileOptions
  }
}
