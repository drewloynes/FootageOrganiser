const fileName: string = 'fullPath.ts'
const area: string = 'path'

export class FullPath {
  #path: string
  #exists: boolean

  constructor(path: string, exists: boolean = false) {
    const funcName: string = 'FullPath Constructor'
    entryLog(funcName, fileName, area)

    this.#path = path
    this.#exists = exists

    exitLog(funcName, fileName, area)
    return
  }

  get path() {
    return this.#path
  }

  get exists() {
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
