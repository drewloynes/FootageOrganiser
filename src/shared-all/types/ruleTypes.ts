import {
  COPY_PATHS_ZOD_SCHEMA,
  FULL_RULE_ZOD_SCHEMA,
  SHORT_RULE_ZOD_SCHEMA,
  STORE_RULE_ZOD_SCHEMA
} from '@shared-all/validation/validateRule'
import { z } from 'zod'

export enum RULE_TYPE {
  COPYFILE = 'Copy File',
  MIRROR = 'Mirror'
}

export enum RULE_STATUS_TYPE {
  UNKNOWN = 'Unknown',
  ERROR = 'Error',
  AWAITING_EVALUATION = 'Awaiting Evaluation',
  EVALUATING = 'Evaluating',
  NOT_EVALUATABLE = 'Not Evaluatable',
  CHECKSUM_RUNNING = 'Calculating Checksum',
  AWAITING_APPROVAL = 'Actions Stopped',
  QUEUED_ACTIONS = 'Actions Queued',
  EXECUTING_ACTIONS = 'Actions Executing',
  NO_WORK = 'No Work',
  DISABLED = 'Disabled'
}

export enum UNEVALUATABLE_REASON {
  AWAITING_EVALUATION = 'Awaiting Evaluation',
  NO_PROBLEM = 'No Problem',
  RULE_DISABLED = 'Rule Disabled',
  ZERO_EXISTING_TARGET_PATHS = 'Zero Existing Target Paths',
  ZERO_EXISTING_ORIGIN_PATHS = 'Zero Existing Origin Paths',
  MIRROR_MULTIPLE_ORIGIN_PATHS = 'Mirror Rule Has Multiple Origin Paths'
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

export type DisableRuleInfo = {
  ruleName: string
  error: string
}

export const STORE_RULE_DEFAULT_VALUES: StoreRule = {
  name: '',
  type: RULE_TYPE.COPYFILE,
  origin: {
    volumeName: '',
    pathFromVolumeRoot: '',
    filesToInclude: [],
    filesToExclude: [],
    dirsToInclude: [],
    dirsToExclude: []
  },
  target: {
    volumeName: '',
    pathFromVolumeRoot: '',
    filesToInclude: [],
    filesToExclude: [],
    dirsToInclude: [],
    dirsToExclude: []
  },
  enableStartStopActions: true,
  disabled: false,
  copyFileOptions: {
    targetSubPathFormat: [],
    customDirectoryName: '',
    deleteCopiedFiles: false,
    deleteUnderOtherPaths: false,
    otherPaths: []
  },
  mirrorOptions: { enableDeletingInTarget: false }
}
