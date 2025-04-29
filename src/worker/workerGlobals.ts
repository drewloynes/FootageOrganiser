import { DriveInfo } from '@worker/drives/driveInfo'
import { Settings } from '@worker/settings/settings'
import { Rules } from '@worker/rules/rules'
import { PromiseResolveRejectTimer, PromiseResolveTimer } from '@shared/utils/promise'
import { StreamUpdate } from '@shared/utils/streamUpdates'
import { sendCurrentRulesStreamToMain } from './rules/currentRules'
import { Rule } from './rules/rule'
import { Change } from './state-changes/change'

const fileName: string = 'workerGlobals.ts'
const area: string = 'worker'

export class WorkerGlobals {
  /* Global useful data for worker */
  // Is the worker setup
  workerSetup: boolean
  // Port to main process
  mainPort: Electron.MessagePortMain | undefined
  // Location of appdata, where we write to disk
  storageLocation: string | undefined
  // Last received information on the drives connected to the OS
  currentDriveInfo: DriveInfo[] | undefined
  // Stream object for streaming all rules to the main process
  streamAllRulesToMain: StreamUpdate
  // The rule currently being evaluated or executed on - Unddfined when not evaluating or executing
  ruleInUse: Rule | undefined
  // List of changes to make at next mvailable moment (When a rule is not in use)
  awaitingChanges: Change[]

  /* Resolving promises */
  // Map for resolving normal SyncIpcMessages
  awaitingIpcMessages: Map<string, PromiseResolveRejectTimer>
  // Map for resolving sleeps
  currentSleeps: Map<string, PromiseResolveTimer>

  /* User Set Data */
  // Current settings used by worker
  currentSettings: Settings | undefined
  // Current settings is about to change to these settings
  upcomingSettings: Settings | undefined
  // Current rules used by worker
  currentRules: Rules | undefined
  // Current rules is about to change to these rules
  upcomingRules: Rules | undefined

  constructor() {
    const funcName: string = 'WorkerGlobals Constructor'
    entryLog(funcName, fileName, area)

    this.workerSetup = false
    this.mainPort = undefined
    this.currentDriveInfo = undefined
    this.storageLocation = undefined
    this.streamAllRulesToMain = new StreamUpdate(500, sendCurrentRulesStreamToMain)
    this.ruleInUse = undefined
    this.awaitingChanges = []

    this.awaitingIpcMessages = new Map()
    this.currentSleeps = new Map()

    this.currentSettings = undefined
    this.upcomingSettings = undefined
    this.currentRules = undefined
    this.upcomingRules = undefined

    exitLog(funcName, fileName, area)
    return
  }
}

export default WorkerGlobals
