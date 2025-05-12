import { PromiseResolveRejectTimer, PromiseResolveTimer } from '@shared-node/utils/promise'
import { StreamUpdate } from '@shared-node/utils/streamUpdates'
import { DriveInfo } from '@worker/drives/driveInfo'
import { Rules } from '@worker/rules/rules'
import { Settings } from '@worker/settings/settings'
import { sendCurrentRulesStreamToMain } from './rules/currentRules'
import { Rule } from './rules/rule'
import { Change } from './state-changes/change'

export class WorkerGlobals {
  /* Global useful data for worker */
  // Is the worker setup
  workerSetup: boolean = false
  // Port to main process
  mainPort: Electron.MessagePortMain | undefined = undefined
  // Location of appdata, where we write to disk
  storageLocation: string | undefined = undefined
  // Last received information on the drives connected to the OS
  currentDriveInfo: DriveInfo[] | undefined = undefined
  // Stream object for streaming all rules to the main process
  streamAllRulesToMain: StreamUpdate = new StreamUpdate(200, sendCurrentRulesStreamToMain)
  // The rule currently being evaluated or executed on - Unddfined when not evaluating or executing
  ruleInUse: Rule | undefined = undefined
  // List of changes to make at next mvailable moment (When a rule is not in use)
  awaitingChanges: Change[] = []

  /* Resolving promises */
  // Map for resolving normal SyncIpcMessages
  awaitingIpcMessages: Map<string, PromiseResolveRejectTimer> = new Map()
  // Map for resolving sleeps
  currentSleeps: Map<string, PromiseResolveTimer> = new Map()

  /* User Set Data */
  // Current settings used by worker
  currentSettings: Settings | undefined = undefined
  // Current settings is about to change to these settings
  upcomingSettings: Settings | undefined = undefined
  // Current rules used by worker
  currentRules: Rules | undefined = undefined
  // Current rules is about to change to these rules
  upcomingRules: Rules | undefined = undefined
}

export default WorkerGlobals
