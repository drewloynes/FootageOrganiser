const fileName = 'fullPath.ts'
const area = 'path'

export class FullPath {
  #path: string
  #exists: boolean

  constructor(path: string, exists = false) {
    const funcName = 'FullPath Constructor'
    entryLog(funcName, fileName, area)

    this.#path = path
    this.#exists = exists

    exitLog(funcName, fileName, area)
    return
  }

  get path(): string {
    return this.#path
  }

  get exists(): boolean {
    return this.#exists
  }

  clone(): FullPath {
    const funcName = 'clone'
    entryLog(funcName, fileName, area)

    const clonedFullPath: FullPath = new FullPath(this.#path, this.#exists)

    exitLog(funcName, fileName, area)
    return clonedFullPath
  }
}
