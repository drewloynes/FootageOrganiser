import {
  COPY_PATHS_ZOD_SCHEMA,
  FULL_RULE_ZOD_SCHEMA,
  SHORT_RULE_ZOD_SCHEMA,
  STORE_RULE_ZOD_SCHEMA
} from '@shared/validation/validateRule'
import { z } from 'zod'
import { DEFAULT_STORE_COPY_FILE_OPTIONS } from './copyFileTypes'
import { DEFAULT_STORE_MIRROR_OPTIONS } from './MirrorTypes'
import { DEFAULT_STORE_PATH_IN_VOLUME } from './pathInVolumeTypes'

export enum RULE_TYPE {
  COPYFILE = 'Copy File',
  MIRROR = 'Mirror'
}

export enum RULE_STATUS_TYPE {
  UNKNOWN = 'unknown',
  ERROR = 'error',
  AWAITING_EVALUATION = 'awaiting-evaluation',
  EVALUATING = 'processing',
  NOT_EVALUATABLE = 'not-evaluatable',
  CHECKSUM_RUNNING = 'checksum-running',
  AWAITING_APPROVAL = 'awaitng-approval',
  QUEUED_ACTIONS = 'queued-actions',
  EXECUTING_ACTIONS = 'executing-actions',
  NO_WORK = 'no-work',
  DISABLED = 'disabled'
}

export enum UNEVALUATABLE_REASON {
  AWAITING_EVALUATION = 'awaiting-evaluation',
  NO_PROBLEM = 'no-problem',
  RULE_DISABLED = 'rule-disabled',
  ZERO_EXISTING_TARGET_PATHS = 'zero-existing-target-paths',
  ZERO_EXISTING_ORIGIN_PATHS = 'zero-existing-origin-paths',
  MIRROR_MULTIPLE_ORIGIN_PATHS = 'mirror-multiple-origin-paths'
}

export type CopyPaths = z.infer<typeof COPY_PATHS_ZOD_SCHEMA>

export type StoreRule = z.infer<typeof STORE_RULE_ZOD_SCHEMA>

export type ShortRule = z.infer<typeof SHORT_RULE_ZOD_SCHEMA>

export type FullRule = z.infer<typeof FULL_RULE_ZOD_SCHEMA>

export type ModifyRuleInfo = {
  originalRuleName: string
  modifiedStoreRule: StoreRule
  error: string
}

export const DEFAULT_STORE_RULE: StoreRule = {
  name: '',
  type: RULE_TYPE.COPYFILE,
  origin: DEFAULT_STORE_PATH_IN_VOLUME,
  target: DEFAULT_STORE_PATH_IN_VOLUME,
  copyFileOptions: DEFAULT_STORE_COPY_FILE_OPTIONS,
  mirrorOptions: DEFAULT_STORE_MIRROR_OPTIONS,
  enableStartStopActions: true,
  disabled: false
}
