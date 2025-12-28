const fileName = 'typeMirrorOptions.ts'
const area = 'rule-options'

export class MirrorOptions {
  // Enables deleting any files and directories in the target path which don't exist in the origin
  #enableDeletingInTarget: boolean

  constructor(enableDeletingInTarget: boolean) {
    const funcName = 'MirrorOptions Constructor'
    entryLog(funcName, fileName, area)

    this.#enableDeletingInTarget = enableDeletingInTarget

    exitLog(funcName, fileName, area)
    return
  }

  get enableDeletingInTarget(): boolean {
    return this.#enableDeletingInTarget
  }

  clone(): MirrorOptions {
    const funcName = 'clone'
    entryLog(funcName, fileName, area)

    const clonedMirrorOptions: MirrorOptions = new MirrorOptions(this.enableDeletingInTarget)

    exitLog(funcName, fileName, area)
    return clonedMirrorOptions
  }
}
