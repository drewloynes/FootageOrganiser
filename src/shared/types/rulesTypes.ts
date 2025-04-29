import { STORE_RULES_ZOD_SCHEMA } from '@shared/validation/validateRules'
import { z } from 'zod'

export type StoreRules = z.infer<typeof STORE_RULES_ZOD_SCHEMA>
