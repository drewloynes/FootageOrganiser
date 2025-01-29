const fileName: string = 'storeRulePath.ts'
const area: string = 'store rules'

// Class for storing RulePath objects to disk
export class StoreRulePath {
  // Cant be private because typescript is being a cunt when loading data and trhing to type cast
  volumeName: string
  volumeRootPath: string

  /* --- Constructor & Getters / Setters --- */

  constructor(volumeName: string, volumeRootPath: string) {
    const funcName = 'StoreRulePath Constructor'
    entryLog(funcName, fileName, area)

    this.volumeName = volumeName
    this.volumeRootPath = volumeRootPath

    exitLog(funcName, fileName, area)
    return
  }

  /* --- Functions --- */
}
