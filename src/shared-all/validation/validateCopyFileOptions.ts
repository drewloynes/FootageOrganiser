import { TARGET_SUB_PATH_FORMAT_OPTIONS } from '@shared-all/types/copyFileTypes'
import { z } from 'zod'
import { validateDirectoryName } from './validateDirectory'
import {
  extraZodValidationStorePathInVolume,
  STORE_PATH_IN_VOLUME_SCHEMA
} from './validatePathInVolume'

export const STORE_COPY_FILE_OPTIONS_SCHEMA = {
  targetSubPathFormat: z.array(z.nativeEnum(TARGET_SUB_PATH_FORMAT_OPTIONS)),
  customDirectoryName: z.string(),
  deleteCopiedFiles: z.boolean(),
  deleteUnderOtherPaths: z.boolean(),
  otherPaths: z.array(z.object(STORE_PATH_IN_VOLUME_SCHEMA))
}

export const STORE_COPY_FILE_OPTIONS_ZOD_SCHEMA = z
  .object(STORE_COPY_FILE_OPTIONS_SCHEMA)
  .superRefine(extraZodValidationCopyFileOptions)

// Cant have logs - Used in all processes
export function extraZodValidationCopyFileOptions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  copyFileOptionsData: any,
  ctx: z.RefinementCtx,
  currentPath: (string | number)[] = []
): void {
  // targetSubPathFormat array must not contain duplicates
  if (
    copyFileOptionsData.targetSubPathFormat.length > 0 &&
    new Set(copyFileOptionsData.targetSubPathFormat).size !==
      copyFileOptionsData.targetSubPathFormat.length
  ) {
    ctx.addIssue({
      path: [...currentPath, 'targetSubPathFormat'],
      code: z.ZodIssueCode.custom,
      message: 'Target sub-path format must not contain duplicates'
    })
  }

  // If we are using customDirectoryName in the extraZodValidationCopyFileOptions, it must be a valid directory name
  if (
    copyFileOptionsData.targetSubPathFormat.includes(TARGET_SUB_PATH_FORMAT_OPTIONS.CUSTOM) &&
    !validateDirectoryName(copyFileOptionsData.customDirectoryName)
  ) {
    ctx.addIssue({
      path: [...currentPath, 'customDirectoryName'],
      code: z.ZodIssueCode.custom,
      message: 'Custom Name is not a valid directory name'
    })
  }

  // If deleteCopiedFiles is false then deleteUnderOtherPaths must be false
  if (
    copyFileOptionsData.deleteCopiedFiles === false &&
    copyFileOptionsData.deleteUnderOtherPaths === true
  ) {
    ctx.addIssue({
      path: [...currentPath, 'deleteUnderOtherPaths'],
      code: z.ZodIssueCode.custom,
      message: `Delete under other paths can't be true when delete copied files is false`
    })
  }

  for (const otherPathData of copyFileOptionsData.otherPaths) {
    extraZodValidationStorePathInVolume(otherPathData, ctx, [
      ...currentPath,
      'otherPaths',
      copyFileOptionsData.otherPaths.indexOf(otherPathData)
    ])
  }

  return
}
