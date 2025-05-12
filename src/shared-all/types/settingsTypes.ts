import { STORE_SETTINGS_ZOD_SCHEMA } from '@shared-all/validation/validateSettings'
import { z } from 'zod'

export type StoreSettings = z.infer<typeof STORE_SETTINGS_ZOD_SCHEMA>
