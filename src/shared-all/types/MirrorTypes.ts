import { STORE_MIRROR_OPTIONS_ZOD_SCHEMA } from '@shared-all/validation/validateMirrorOptions'
import { z } from 'zod'

export type StoreMirrorOptions = z.infer<typeof STORE_MIRROR_OPTIONS_ZOD_SCHEMA>

export const DEFAULT_STORE_MIRROR_OPTIONS: StoreMirrorOptions = {
  enableDeletingInTarget: false
}
