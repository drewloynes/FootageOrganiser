import { z } from 'zod'

export const STORE_MIRROR_OPTIONS_SCHEMA = {
  enableDeletingInTarget: z.boolean()
}

export const STORE_MIRROR_OPTIONS_ZOD_SCHEMA = z.object(STORE_MIRROR_OPTIONS_SCHEMA)
