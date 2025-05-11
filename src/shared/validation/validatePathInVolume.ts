import { z } from 'zod'
import { validateDirNameFilter, validatePartialDirectoryPath } from './validateDirectory'
import { validateFileNameFilter } from './validateFile'

export const SHORT_PATH_IN_VOLUME_SCHEMA = {
  volumeName: z.string().min(1),
  pathFromVolumeRoot: z.string()
}

export const STORE_PATH_IN_VOLUME_SCHEMA = {
  ...SHORT_PATH_IN_VOLUME_SCHEMA,
  filesToInclude: z.array(z.string()),
  filesToExclude: z.array(z.string()),
  dirsToInclude: z.array(z.string()),
  dirsToExclude: z.array(z.string())
}

export const SHORT_PATH_IN_VOLUME_ZOD_SCHEMA = z
  .object(SHORT_PATH_IN_VOLUME_SCHEMA)
  .superRefine(extraZodValidationShortPathInVolume)

export const STORE_PATH_IN_VOLUME_ZOD_SCHEMA = z
  .object(STORE_PATH_IN_VOLUME_SCHEMA)
  .superRefine(extraZodValidationStorePathInVolume)

// Cant have logs - Used in all processes
export function extraZodValidationShortPathInVolume(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shortPathInVolumeData: any,
  ctx: z.RefinementCtx,
  currentPath: (string | number)[] = []
): void {
  // pathFromVolumeRoot must be a valid partial directory path
  if (!validatePartialDirectoryPath(shortPathInVolumeData.pathFromVolumeRoot)) {
    ctx.addIssue({
      path: [...currentPath, 'pathFromVolumeRoot'],
      code: z.ZodIssueCode.custom,
      message: 'Path from the volume root is not a valid directory path'
    })
  }
}

// Cant have logs - Used in all processes
export function extraZodValidationStorePathInVolume(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storePathInVolumeData: any,
  ctx: z.RefinementCtx,
  currentPath: (string | number)[] = []
): void {
  extraZodValidationShortPathInVolume(storePathInVolumeData, ctx, currentPath)

  // filesToInclude array must contain valid file name filter strings
  if (
    !storePathInVolumeData.filesToInclude.every((fileNameFilter: string) =>
      validateFileNameFilter(fileNameFilter)
    )
  ) {
    ctx.addIssue({
      path: [...currentPath, 'filesToInclude'],
      code: z.ZodIssueCode.custom,
      message: 'Files to include contains invalid file name filters'
    })
  }

  // filesToExclude array must contain valid file name filter strings
  if (
    !storePathInVolumeData.filesToExclude.every((fileNameFilter: string) =>
      validateFileNameFilter(fileNameFilter)
    )
  ) {
    ctx.addIssue({
      path: [...currentPath, 'filesToExclude'],
      code: z.ZodIssueCode.custom,
      message: 'Files to exclude contains invalid file name filters'
    })
  }

  // dirsToInclude array must contain valid dir name filter strings
  if (
    !storePathInVolumeData.dirsToInclude.every((fileNameFilter: string) =>
      validateDirNameFilter(fileNameFilter)
    )
  ) {
    ctx.addIssue({
      path: [...currentPath, 'dirsToInclude'],
      code: z.ZodIssueCode.custom,
      message: 'Folders to include contains invalid folder name filters'
    })
  }

  // dirsToExclude array must contain valid dir name filter strings
  if (
    !storePathInVolumeData.dirsToExclude.every((fileNameFilter: string) =>
      validateDirNameFilter(fileNameFilter)
    )
  ) {
    ctx.addIssue({
      path: [...currentPath, 'dirsToExclude'],
      code: z.ZodIssueCode.custom,
      message: 'Folders to exclude contains invalid folder name filters'
    })
  }
}
