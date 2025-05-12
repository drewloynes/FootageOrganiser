import {
  SHORT_PATH_IN_VOLUME_ZOD_SCHEMA,
  STORE_PATH_IN_VOLUME_ZOD_SCHEMA
} from '@shared-all/validation/validatePathInVolume'
import { z } from 'zod'

export type ShortPathInVolume = z.infer<typeof SHORT_PATH_IN_VOLUME_ZOD_SCHEMA>

export type StorePathInVolume = z.infer<typeof STORE_PATH_IN_VOLUME_ZOD_SCHEMA>

export const DEFAULT_STORE_PATH_IN_VOLUME: StorePathInVolume = {
  volumeName: '',
  pathFromVolumeRoot: '',
  filesToInclude: [],
  filesToExclude: [],
  dirsToInclude: [],
  dirsToExclude: []
}
