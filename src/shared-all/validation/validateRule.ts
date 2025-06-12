import { RULE_STATUS_TYPE, RULE_TYPE, UNEVALUATABLE_REASON } from '@shared-all/types/ruleTypes'
import { z } from 'zod'
import {
  extraZodValidationCopyFileOptions,
  STORE_COPY_FILE_OPTIONS_SCHEMA
} from './validateCopyFileOptions'
import { STORE_MIRROR_OPTIONS_SCHEMA } from './validateMirrorOptions'
import {
  extraZodValidationStorePathInVolume,
  STORE_PATH_IN_VOLUME_SCHEMA
} from './validatePathInVolume'

export const COPY_PATHS_SCHEMA = {
  from: z.string().min(1),
  to: z.string().min(1)
}

export const STORE_RULE_SCHEMA = {
  name: z.string().min(1, 'Name must be at last one character'),
  type: z.nativeEnum(RULE_TYPE),
  origin: z.object(STORE_PATH_IN_VOLUME_SCHEMA),
  target: z.object(STORE_PATH_IN_VOLUME_SCHEMA),
  copyFileOptions: z.object(STORE_COPY_FILE_OPTIONS_SCHEMA),
  mirrorOptions: z.object(STORE_MIRROR_OPTIONS_SCHEMA),
  enableStartStopActions: z.boolean(),
  disabled: z.boolean()
}

export const SHORT_RULE_SCHEMA = {
  ...STORE_RULE_SCHEMA,
  startActions: z.boolean(),
  evaluateRule: z.boolean(),
  awaitingChanges: z.boolean(),
  status: z.nativeEnum(RULE_STATUS_TYPE),
  unevaluateableReason: z.nativeEnum(UNEVALUATABLE_REASON),
  checksumAction: z.string(),
  executingAction: z.string(),
  actionsProgress: z.number().min(0).max(100),
  error: z.string()
}

export const FULL_RULE_SCHEMA = {
  ...SHORT_RULE_SCHEMA,
  dirMakeActionQueue: z.array(z.string()),
  dirDeleteActionQueue: z.array(z.string()),
  fileCopyActionQueue: z.array(z.object(COPY_PATHS_SCHEMA)),
  fileDeleteActionQueue: z.array(z.string())
}

export const COPY_PATHS_ZOD_SCHEMA = z.object(COPY_PATHS_SCHEMA)

export const STORE_RULE_ZOD_SCHEMA = z
  .object(STORE_RULE_SCHEMA)
  .superRefine(extraZodValidationStoreRule)

export const SHORT_RULE_ZOD_SCHEMA = z.object(SHORT_RULE_SCHEMA)

export const FULL_RULE_ZOD_SCHEMA = z.object(FULL_RULE_SCHEMA)

// Cant have logs - Used in all processes
export function extraZodValidationStoreRule(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storeRuleData: any,
  ctx: z.RefinementCtx,
  currentPath: (string | number)[] = []
): void {
  // Check origin
  extraZodValidationStorePathInVolume(storeRuleData.origin, ctx, [...currentPath, 'origin'])

  // Check target
  extraZodValidationStorePathInVolume(storeRuleData.target, ctx, [...currentPath, 'target'])

  // Check copy path options
  extraZodValidationCopyFileOptions(storeRuleData.copyFileOptions, ctx, [
    ...currentPath,
    'copyFileOptions'
  ])

  // The path of target cant be inside path of origin
  if (
    storeRuleData.origin.volumeName !== '' &&
    storeRuleData.target.volumeName !== '' &&
    storeRuleData.origin.volumeName === storeRuleData.target.volumeName &&
    storeRuleData.target.pathFromVolumeRoot.startsWith(storeRuleData.origin.pathFromVolumeRoot)
  ) {
    ctx.addIssue({
      path: [...currentPath, 'target'],
      code: z.ZodIssueCode.custom,
      message: 'Target path can not be inside origin path'
    })
  }
}
