const fileName = 'typeMirrorOptions.ts'
const area = 'rule options'

export class TypeMirrorOptions {
  private deleteExtrasInTo: boolean
  private deleteInclude: string[]
  private deleteExclude: string[]
  private dirDeleteInclude: string[]
  private dirDeleteExclude: string[]

  constructor(
    deleteExrasInTo: boolean,
    deleteInclude: string[],
    deleteExclude: string[],
    dirDeleteInclude: string[],
    dirDeleteExclude: string[]
  ) {
    const funcName = 'TypeMirrorOptions Constructor'
    entryLog(funcName, fileName, area)

    this.deleteExtrasInTo = deleteExrasInTo
    this.deleteInclude = deleteInclude
    this.deleteExclude = deleteExclude
    this.dirDeleteInclude = dirDeleteInclude
    this.dirDeleteExclude = dirDeleteExclude

    exitLog(funcName, fileName, area)
    return
  }

  getDeleteExtrasInTo(): boolean {
    const funcName = 'getDeleteExtrasInTo'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.deleteExtrasInTo
  }

  getDeleteInclude(): string[] {
    const funcName = 'getDeleteInclude'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.deleteInclude
  }

  getDeleteExclude(): string[] {
    const funcName = 'getDeleteExclude'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.deleteExclude
  }

  getDirDeleteInclude(): string[] {
    const funcName = 'getDirDeleteInclude'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.dirDeleteInclude
  }

  getDirDeleteExclude(): string[] {
    const funcName = 'getDirDeleteExclude'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.dirDeleteExclude
  }
}
