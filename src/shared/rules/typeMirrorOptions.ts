const fileName = 'typeMirrorOptions.ts'
const area = 'rule options'

export class TypeMirrorOptions {
  private deleteExtrasInTo: boolean

  constructor(deleteExrasInTo: boolean) {
    const funcName = 'TypeMirrorOptions Constructor'
    entryLog(funcName, fileName, area)

    this.deleteExtrasInTo = deleteExrasInTo

    exitLog(funcName, fileName, area)
    return
  }

  getDeleteExtrasInTo(): boolean {
    const funcName = 'getDeleteExtrasInTo'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.deleteExtrasInTo
  }
}
