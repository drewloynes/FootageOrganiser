import { StoreMirrorOptions } from '@shared-all/types/MirrorTypes'
import { MirrorOptions } from '@worker/rules/mirrorOptions'

const fileName = 'storeMirrorOptions.ts'
const area = 'store-rules'

export function toMirrorOptions(storeMirrorOptions: StoreMirrorOptions): MirrorOptions {
  const funcName = 'toMirrorOptions'
  entryLog(funcName, fileName, area)

  const mirrorOptions: MirrorOptions = new MirrorOptions(storeMirrorOptions.enableDeletingInTarget)

  exitLog(funcName, fileName, area)
  return mirrorOptions
}

export function toStoreMirrorOptions(mirrorOptions: MirrorOptions): StoreMirrorOptions {
  const funcName = 'toStoreMirrorOptions'
  entryLog(funcName, fileName, area)

  const storeMirrorOptions: StoreMirrorOptions = {
    enableDeletingInTarget: mirrorOptions.enableDeletingInTarget
  }

  exitLog(funcName, fileName, area)
  return storeMirrorOptions
}
