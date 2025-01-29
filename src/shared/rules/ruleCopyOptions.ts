const fileName = 'ruleCopyOptions.ts'
const area = 'rule options'

export class RuleCopyOptions {
  copyInclude: string[]
  copyExclude: string[]
  dirCopyInclude: string[]
  dirCopyExclude: string[]

  constructor(
    copyInclude: string[],
    copyExclude: string[],
    dirCopyInclude: string[],
    dirCopyExclude: string[]
  ) {
    const funcName = 'RuleCopyOptions Constructor'
    entryLog(funcName, fileName, area)

    this.copyInclude = copyInclude
    this.copyExclude = copyExclude

    this.dirCopyInclude = dirCopyInclude
    this.dirCopyExclude = dirCopyExclude

    exitLog(funcName, fileName, area)
    return
  }

  getCopyInclude(): string[] {
    const funcName = 'getCopyIncldue'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.copyInclude
  }

  getCopyExclude(): string[] {
    const funcName = 'getCopyExclude'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.copyExclude
  }

  getDirCopyInclude(): string[] {
    const funcName = 'getDirCopyInclude'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.dirCopyInclude
  }

  getDirCopyExclude(): string[] {
    const funcName = 'getDirCopyExclude'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.dirCopyInclude
  }
}
