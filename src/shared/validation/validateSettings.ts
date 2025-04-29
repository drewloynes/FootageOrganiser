import { CHECKSUM_TYPE } from '@shared/types/checksumTypes'
import { z } from 'zod'

const fileName = 'validateSettings.ts'
const area = 'validation'

export const STORE_SETTINGS_SCHEMA = {
  footageOrganiserVersion: z.string(),
  actionsCutoffInGBs: z.number().min(1),
  deleteOldLogsInDays: z.number().min(1).int(),
  checksumMethod: z.nativeEnum(CHECKSUM_TYPE),
  reevaluateSleepTime: z.number().min(1).int()
}

export const STORE_SETTINGS_ZOD_SCHEMA = z
  .object(STORE_SETTINGS_SCHEMA)
  .superRefine(extraZodValidationStoreRule)

export function extraZodValidationStoreRule(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storeSettingsData: any,
  ctx: z.RefinementCtx
): void {
  if (!validateSemverFormat(storeSettingsData.footageOrganiserVersion)) {
    ctx.addIssue({
      path: ['footageOrganiserVersion'],
      code: z.ZodIssueCode.custom,
      message: 'Current version of settings is not semver'
    })
  }
}

function validateSemverFormat(semverString: string): boolean {
  return /^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z-.]+)?(?:\+[0-9A-Za-z-.]+)?$/.test(semverString)
}
