import { RulePath } from '@shared/rules/rulePath'

const fileName: string = 'storeRulePath.ts'
const area: string = 'store-rules'

// Class for storing RulePath objects to disk
// Storing only necessary variables
export class StoreRulePath {
  // Cant be private because typescript is being a cunt when loading data and trhing to type cast
  volumeName: string
  volumeRootPath: string
  filesToInclude: string[]
  filesToExclude: string[]
  dirsToInclude: string[]
  dirsToExclude: string[]

  /* --- Constructor & Getters / Setters --- */

  constructor(rulePath: RulePath) {
    const funcName = 'StoreRulePath Constructor'
    entryLog(funcName, fileName, area)

    this.volumeName = rulePath.getVolumeName()
    this.volumeRootPath = rulePath.getVolumeRootPath()
    this.filesToInclude = rulePath.getFilesToInclude()
    this.filesToExclude = rulePath.getFilesToExclude()
    this.dirsToInclude = rulePath.getDirsToInclude()
    this.dirsToExclude = rulePath.getDirsToExclude()

    exitLog(funcName, fileName, area)
    return
  }

  /* --- Functions --- */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toRulePath(data: any): RulePath {
    const funcName = 'toRulePath'
    entryLog(funcName, fileName, area)

    if (data.volumeName === undefined) {
      throw 'Cant find rulePath.volumeName'
    }
    if (data.volumeRootPath === undefined) {
      throw 'Cant find rulePath.volumeRootPath'
    }
    if (data.filesToInclude === undefined) {
      throw 'Cant find rulePath.filesToInclude'
    }
    if (data.filesToExclude === undefined) {
      throw 'Cant find rulePath.filesToExclude'
    }
    if (data.dirsToInclude === undefined) {
      throw 'Cant find rulePath.dirsToInclude'
    }
    if (data.dirsToExclude === undefined) {
      throw 'Cant find rulePath.dirsToExclude'
    }
    // TODO: data validation
    const rulePath: RulePath = new RulePath(
      data.volumeName,
      data.volumeRootPath,
      data.filesToInclude,
      data.filesToExclude,
      data.dirsToInclude,
      data.dirsToExclude
    )

    exitLog(funcName, fileName, area)
    return rulePath
  }
}
