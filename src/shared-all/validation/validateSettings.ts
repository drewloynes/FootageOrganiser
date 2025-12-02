import { CHECKSUM_TYPE } from '@shared-all/types/checksumTypes'
import { z } from 'zod'

export const STORE_SETTINGS_SCHEMA = {
  footageOrganiserVersion: z.string(),
  actionsCutoffInGBs: z.coerce.number().min(1, 'Must be at least 1 GB').int('Must be an integer'),
  deleteOldLogsInDays: z.coerce.number().min(1, 'Must be at least 1 day').int('Must be an integer'),
  checksumMethod: z.nativeEnum(CHECKSUM_TYPE),
  reevaluateSleepTime: z.coerce
    .number()
    .min(1, 'Must be at least 1 minute')
    .int('Must be an integer')
}

export const STORE_SETTINGS_ZOD_SCHEMA = z
  .object(STORE_SETTINGS_SCHEMA)
  .superRefine(extraZodValidationStoreRule)

// Cant have logs - Used in all processes
export function extraZodValidationStoreRule(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storeSettingsData: any,
  ctx: z.RefinementCtx
): void {
  if (!validateSemverFormat(storeSettingsData.footageOrganiserVersion)) {
    ctx.addIssue({
      path: ['footageOrganiserVersion'],
      code: 'custom',
      message: 'Current version of settings is not semver'
    })
  }
}

function validateSemverFormat(semverString: string): boolean {
  return /^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z-.]+)?(?:\+[0-9A-Za-z-.]+)?$/.test(semverString)
}
