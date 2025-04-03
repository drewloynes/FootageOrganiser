import { RulePath } from '@shared/rules/rulePath'
import { TypeCopyFileFormatOptions, TypeCopyFileOptions } from '@shared/rules/typeCopyFileOptions'
import { TypeMirrorOptions } from '@shared/rules/typeMirrorOptions'
import { createRulePathFromStringArray } from './rulePathUtils'

const fileName: string = 'typeOptions.ts'
const area: string = 'rule'

export function fillCopyTypeOptions(
  copyFormat: string[],
  customName: string,
  autoCleanFromPath: boolean,
  deleteExtra: boolean,
  deleteExtraPaths: object[]
): TypeCopyFileOptions {
  const funcName: string = 'fillCopyTypeOptions'
  entryLog(funcName, fileName, area)

  const fixedCopyFormat = fixCopyFormat(copyFormat)

  const deleteExtraRulePaths: RulePath[] = []
  for (const extraPath of deleteExtraPaths) {
    condLog(`For path`, funcName, fileName, area)

    const newExtraRulePath = createRulePathFromStringArray(
      extraPath.DeleteExtraPath,
      extraPath.deleteExtraFileInclude,
      extraPath.deleteExtraFileExclude,
      extraPath.deleteExtraFolderInclude,
      extraPath.deleteExtraFolderExclude
    )

    deleteExtraRulePaths.push(newExtraRulePath)
  }

  const typeOptions = new TypeCopyFileOptions(
    fixedCopyFormat,
    customName,
    autoCleanFromPath,
    deleteExtra,
    deleteExtraRulePaths
  )

  exitLog(funcName, fileName, area)
  return typeOptions
}

export function fillMirrorOptions(cleanTarget: boolean): TypeMirrorOptions {
  const funcName: string = 'fillMirrorOptions'
  entryLog(funcName, fileName, area)

  const typeOptions = new TypeMirrorOptions(cleanTarget)

  exitLog(funcName, fileName, area)
  return typeOptions
}

function fixCopyFormat(originalCopyFormat): TypeCopyFileFormatOptions[] {
  const funcName: string = 'fixCopyFormat'
  entryLog(funcName, fileName, area)

  const fixedCopyFormat: TypeCopyFileFormatOptions[] = []
  for (const formatItem of originalCopyFormat) {
    condLog(`Current rules found`, funcName, fileName, area)
    switch (formatItem) {
      case 'Day': {
        fixedCopyFormat.push(TypeCopyFileFormatOptions.DAY)
        break
      }
      case 'Month': {
        fixedCopyFormat.push(TypeCopyFileFormatOptions.MONTH)
        break
      }
      case 'Year': {
        fixedCopyFormat.push(TypeCopyFileFormatOptions.YEAR)
        break
      }
      case 'Volume Name': {
        fixedCopyFormat.push(TypeCopyFileFormatOptions.VOLUME_NAME)
        break
      }
      case 'File Format': {
        fixedCopyFormat.push(TypeCopyFileFormatOptions.FILE_FORMAT)
        break
      }
      case 'Custom': {
        fixedCopyFormat.push(TypeCopyFileFormatOptions.CUSTOM)
        break
      }
    }
  }

  exitLog(funcName, fileName, area)
  return fixedCopyFormat
}
