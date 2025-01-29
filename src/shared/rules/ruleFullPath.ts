const fileName: string = 'ruleFullPath.ts'
const area: string = 'rules'

export class RuleFullPath {
  private path: string
  private exists: boolean

  constructor(path: string, exists: boolean = false) {
    const funcName: string = 'RuleFullPath Constructor'
    entryLog(funcName, fileName, area)

    this.path = path
    this.exists = exists

    exitLog(funcName, fileName, area)
    return
  }

  getPath(): string {
    const funcName: string = 'getPath'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.path
  }

  getExists(): boolean {
    const funcName: string = 'getExists'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.exists
  }
}
