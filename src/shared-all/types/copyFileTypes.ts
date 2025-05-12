import { STORE_COPY_FILE_OPTIONS_ZOD_SCHEMA } from '@shared-all/validation/validateCopyFileOptions'
import { z } from 'zod'

export enum TARGET_SUB_PATH_FORMAT_OPTIONS {
  YEAR = 'Year',
  MONTH = 'Month',
  DAY = 'Day',
  VOLUME_NAME = 'Volume Name',
  FILE_FORMAT = 'File Format',
  CUSTOM = 'Custom'
}

export type StoreCopyFileOptions = z.infer<typeof STORE_COPY_FILE_OPTIONS_ZOD_SCHEMA>

export const DEFAULT_STORE_COPY_FILE_OPTIONS: StoreCopyFileOptions = {
  targetSubPathFormat: [],
  customDirectoryName: '',
  deleteCopiedFiles: false,
  deleteUnderOtherPaths: false,
  otherPaths: []
}
