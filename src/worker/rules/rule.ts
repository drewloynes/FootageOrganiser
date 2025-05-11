import {
  CopyPaths,
  FullRule,
  RULE_STATUS_TYPE,
  RULE_TYPE,
  ShortRule,
  UNEVALUATABLE_REASON
} from '@shared/types/ruleTypes'
import { StreamUpdate } from '@shared/utils/streamUpdates'
import { PathInVolume } from '@worker/path/pathInVolume'
import { toStorePathInVolume } from '@worker/storage/path/storePathInVolume'
import { toStoreCopyFileOptions } from '@worker/storage/rules/storeCopyFileOptions'
import { toStoreMirrorOptions } from '@worker/storage/rules/storeMirrorOptions'
import { CopyFileOptions } from './copyFileOptions'
import { sendRuleStreamToMain, streamUpdateCurrentRules } from './currentRules'
import { MirrorOptions } from './mirrorOptions'

const fileName = 'rule.ts'
const area = 'rules'

export class Rule {
  // Rule name (Used as its ID)
  #name: string
  // Type of rule
  #type: RULE_TYPE
  // Origin and target paths to copy from and to
  #origin: PathInVolume
  #target: PathInVolume
  // Extra options per rule type and options specific for coping
  #copyFileOptions: CopyFileOptions
  #mirrorOptions: MirrorOptions
  // Whether to set the rule as stopped after each processing - requiring confirmation to proceed
  #enableStartStopActions: boolean
  // Pause prcoessing of rule
  #disabled: boolean

  // Start executing on any actions
  startActions: boolean = true
  // Whether the rule is requiring evaluation
  evaluateRule: boolean = true

  // Queues for making or deleting directorys
  // - Lists of directorie paths to make or delete
  dirMakeActionQueue: string[] = []
  dirDeleteActionQueue: string[] = []
  // Queues for copying or deleting files
  // - List of objects of paths to files copying from (origin path) and to (target path)
  // - List of paths of files to delete
  fileCopyActionQueue: CopyPaths[] = []
  fileDeleteActionQueue: string[] = []

  // Rule status
  #status: RULE_STATUS_TYPE = RULE_STATUS_TYPE.AWAITING_EVALUATION
  // Reason if the rule is currently unevaluatable
  // (E.G. do full paths exists, is a mirror trying to mirror from multiple paths)
  #unevaluateableReason: UNEVALUATABLE_REASON = UNEVALUATABLE_REASON.AWAITING_EVALUATION
  // Current checksum action being performed
  #checksumAction: string = ''
  // Current executing action being performed
  #executingAction: string = ''
  // Current progress through actions when executing
  #actionsProgress: number = 0
  // Problem encountered by rule
  #error: string = ''

  // StreamUpdate object for streaming rule to main
  streamToMain: StreamUpdate = new StreamUpdate(200, sendRuleStreamToMain)

  constructor(
    ruleName: string,
    type: RULE_TYPE,
    origin: PathInVolume,
    target: PathInVolume,
    copyFileOptions: CopyFileOptions,
    mirrorOptions: MirrorOptions,
    enableStartStopActions: boolean,
    disabled: boolean
  ) {
    const funcName = 'Rule Constructor'
    entryLog(funcName, fileName, area)

    this.#name = ruleName
    this.#type = type
    this.#origin = origin
    this.#target = target
    this.#copyFileOptions = copyFileOptions
    this.#mirrorOptions = mirrorOptions
    this.#enableStartStopActions = enableStartStopActions
    this.#disabled = disabled

    if (enableStartStopActions || disabled) {
      condLog('Rule requires approval of actions or is disabled', funcName, fileName, area)
      this.startActions = false
    }

    if (disabled) {
      condLog('Rule is disabled', funcName, fileName, area)
      this.evaluateRule = false
      this.#status = RULE_STATUS_TYPE.DISABLED
      this.#unevaluateableReason = UNEVALUATABLE_REASON.RULE_DISABLED
    }

    exitLog(funcName, fileName, area)
    return
  }

  get name() {
    return this.#name
  }

  get type() {
    return this.#type
  }

  get origin() {
    return this.#origin
  }

  get target() {
    return this.#target
  }

  get copyFileOptions() {
    return this.#copyFileOptions
  }

  get mirrorOptions() {
    return this.#mirrorOptions
  }

  get enableStartStopActions() {
    return this.#enableStartStopActions
  }

  get disabled() {
    return this.#disabled
  }

  get status() {
    return this.#status
  }

  clone(): Rule {
    const funcName = 'clone'
    entryLog(funcName, fileName, area)

    const clonedOrigin: PathInVolume = this.origin.clone()
    const clonedTarget: PathInVolume = this.target.clone()
    const clonedCopyFileOptions: CopyFileOptions = this.copyFileOptions.clone()
    const clonedMirrorOptions: MirrorOptions = this.mirrorOptions.clone()

    const clonedRule: Rule = new Rule(
      this.name,
      this.type,
      clonedOrigin,
      clonedTarget,
      clonedCopyFileOptions,
      clonedMirrorOptions,
      this.enableStartStopActions,
      this.disabled
    )

    clonedRule.startActions = this.startActions
    clonedRule.evaluateRule = this.evaluateRule
    clonedRule.#status = this.#status
    clonedRule.#unevaluateableReason = this.#unevaluateableReason
    clonedRule.#checksumAction = this.#checksumAction
    clonedRule.#executingAction = this.#executingAction
    clonedRule.#actionsProgress = this.#actionsProgress
    clonedRule.#error = this.#error
    clonedRule.dirMakeActionQueue = this.dirMakeActionQueue
    clonedRule.dirDeleteActionQueue = this.dirDeleteActionQueue
    clonedRule.fileCopyActionQueue = this.fileCopyActionQueue
    clonedRule.fileDeleteActionQueue = this.fileDeleteActionQueue
    clonedRule.streamToMain = this.streamToMain

    exitLog(funcName, fileName, area)
    return clonedRule
  }

  convertToShortRule(): ShortRule {
    const funcName = 'convertToShortRule'
    entryLog(funcName, fileName, area)

    const sendableObject: ShortRule = {
      name: this.name,
      type: this.type,
      origin: toStorePathInVolume(this.origin),
      target: toStorePathInVolume(this.target),
      copyFileOptions: toStoreCopyFileOptions(this.copyFileOptions),
      mirrorOptions: toStoreMirrorOptions(this.mirrorOptions),
      enableStartStopActions: this.enableStartStopActions,
      disabled: this.disabled,
      startActions: this.startActions,
      evaluateRule: this.evaluateRule,
      status: this.#status,
      unevaluateableReason: this.#unevaluateableReason,
      checksumAction: this.#checksumAction,
      executingAction: this.#executingAction,
      actionsProgress: this.#actionsProgress,
      error: this.#error
    }

    exitLog(funcName, fileName, area)
    return sendableObject
  }

  convertToFullRule(): FullRule {
    const funcName = 'convertToFullRule'
    entryLog(funcName, fileName, area)

    const sendableObjectAllDetail: FullRule = {
      ...this.convertToShortRule(),
      dirMakeActionQueue: this.dirMakeActionQueue,
      dirDeleteActionQueue: this.dirDeleteActionQueue,
      fileCopyActionQueue: this.fileCopyActionQueue,
      fileDeleteActionQueue: this.fileDeleteActionQueue
    }

    exitLog(funcName, fileName, area)
    return sendableObjectAllDetail
  }

  setStatus(status: RULE_STATUS_TYPE): void {
    const funcName = 'setStatus'
    entryLog(funcName, fileName, area)

    if (this.#status !== status) {
      condLog(`Status changing`, funcName, fileName, area)
      this.#status = status
      // Update rule data for streaming
      streamUpdateCurrentRules()
      this.streamToMain.updateData(this)
    }

    exitLog(funcName, fileName, area)
    return
  }

  setChecksumAction(checksumAction: string): void {
    const funcName = 'setChecksumAction'
    entryLog(funcName, fileName, area)

    if (this.#checksumAction !== checksumAction) {
      condLog(`Checksum action changing`, funcName, fileName, area)
      this.#checksumAction = checksumAction
      // Update rule data for streaming
      streamUpdateCurrentRules()
      this.streamToMain.updateData(this)
    }

    exitLog(funcName, fileName, area)
    return
  }

  setUnevaluateableReason(unevaluateableReason: UNEVALUATABLE_REASON): void {
    const funcName = 'setUnevaluateableReason'
    entryLog(funcName, fileName, area)

    if (this.#unevaluateableReason !== unevaluateableReason) {
      condLog(`Unevaluateable reason changing`, funcName, fileName, area)
      this.#unevaluateableReason = unevaluateableReason
      // Update rule data for streaming
      streamUpdateCurrentRules()
      this.streamToMain.updateData(this)
    }

    exitLog(funcName, fileName, area)
    return
  }

  setExecutingAction(executingAction: string): void {
    const funcName = 'setExecutingAction'
    entryLog(funcName, fileName, area)

    if (this.#executingAction !== executingAction) {
      condLog(`Executing action changing`, funcName, fileName, area)
      this.#executingAction = executingAction
      // Update rule data for streaming
      streamUpdateCurrentRules()
      this.streamToMain.updateData(this)
    }

    exitLog(funcName, fileName, area)
    return
  }

  setActionsProgress(actionsProgress: number): void {
    const funcName = 'setActionsProgress'
    entryLog(funcName, fileName, area)

    if (this.#actionsProgress !== actionsProgress) {
      condLog(`Action progress changing`, funcName, fileName, area)
      this.#actionsProgress = actionsProgress
      // Update rule data for streaming
      streamUpdateCurrentRules()
      this.streamToMain.updateData(this)
    }

    exitLog(funcName, fileName, area)
    return
  }

  setError(error: string): void {
    const funcName = 'setError'
    entryLog(funcName, fileName, area)

    if (this.#error !== error) {
      condLog(`Error changing`, funcName, fileName, area)
      this.#error = error
      // Update rule data for streaming
      streamUpdateCurrentRules()
      this.streamToMain.updateData(this)
    }

    exitLog(funcName, fileName, area)
    return
  }

  setStartActions(startActions: boolean): void {
    const funcName = 'startActions'
    entryLog(funcName, fileName, area)

    if (this.startActions !== startActions) {
      condLog(`Start actions changing`, funcName, fileName, area)
      this.startActions = startActions
      // Update rule data for streaming
      streamUpdateCurrentRules()
      this.streamToMain.updateData(this)
    }

    exitLog(funcName, fileName, area)
    return
  }

  // Silent as set to evaluate but dont change the status
  setSilentEvaluate(): void {
    const funcName = 'setSilentEvaluate'
    entryLog(funcName, fileName, area)

    // Only set evaluate when not awaiting approval
    if (!this.hasActions() && !this.disabled) {
      condLog(`No actions in queues - set evaluate`, funcName, fileName, area)
      this.evaluateRule = true
      // Update rule data for streaming
      streamUpdateCurrentRules()
      this.streamToMain.updateData(this)
    }

    exitLog(funcName, fileName, area)
    return
  }

  setEvaluate(): void {
    const funcName: string = 'setEvaluate'
    entryLog(funcName, fileName, area)

    if (!this.disabled) {
      condLog('Rule is not disabled', funcName, fileName, area)
      this.evaluateRule = true
      this.startActions = false

      this.dirDeleteActionQueue = []
      this.dirMakeActionQueue = []
      this.fileCopyActionQueue = []
      this.fileDeleteActionQueue = []

      this.#status = RULE_STATUS_TYPE.AWAITING_EVALUATION
      this.#unevaluateableReason = UNEVALUATABLE_REASON.AWAITING_EVALUATION
      this.#checksumAction = ''
      this.#executingAction = ''
      this.#actionsProgress = 0
      this.#error = ''
      // Update rule data for streaming
      streamUpdateCurrentRules()
      this.streamToMain.updateData(this)
    }

    exitLog(funcName, fileName, area)
    return
  }

  setDisabled(disabled: boolean): void {
    const funcName: string = 'setDisabled'
    entryLog(funcName, fileName, area)

    this.#disabled = disabled

    exitLog(funcName, fileName, area)
    return
  }

  hasActions(): boolean {
    const funcName = 'hasActions'
    entryLog(funcName, fileName, area)

    let hasActions: boolean = false
    if (
      this.dirMakeActionQueue.length > 0 ||
      this.dirDeleteActionQueue.length > 0 ||
      this.fileCopyActionQueue.length > 0 ||
      this.fileDeleteActionQueue.length > 0
    ) {
      condLog(`There are actions in the action queues`, funcName, fileName, area)
      hasActions = true
    }

    exitLog(funcName, fileName, area)
    return hasActions
  }

  hasExecutableActions(): boolean {
    const funcName = 'hasExecutableActions'
    entryLog(funcName, fileName, area)

    let hasExecuatableActions: boolean = false
    if (this.hasActions() && this.startActions && !this.evaluateRule) {
      condLog(`There are executable actions in the action queues`, funcName, fileName, area)
      hasExecuatableActions = true
    }

    exitLog(funcName, fileName, area)
    return hasExecuatableActions
  }

  stop(): void {
    const funcName = 'stop'
    entryLog(funcName, fileName, area)

    if (this.evaluateRule) {
      condExitLog(`Rule is requiring evaluation - skip`, funcName, fileName, area)
      return
    }

    if (this.disabled) {
      condExitLog(`Rule is disabled - skip`, funcName, fileName, area)
      return
    }

    if (!this.enableStartStopActions) {
      condExitLog(`Rule does not have enableStartStopActions set - skip`, funcName, fileName, area)
      return
    }

    if (
      this.status !== RULE_STATUS_TYPE.QUEUED_ACTIONS &&
      this.status !== RULE_STATUS_TYPE.EXECUTING_ACTIONS
    ) {
      condExitLog(
        `Rule does not currently have actions to execute - skip`,
        funcName,
        fileName,
        area
      )
      return
    }

    if (!this.startActions) {
      condExitLog(`startActions is already false - skip`, funcName, fileName, area)
      return
    }

    this.setStartActions(false)
    this.setExecutingAction('')
    this.setActionsProgress(0)

    if (this.hasActions()) {
      condLog(`There are actions in the action queues`, funcName, fileName, area)
      this.setStatus(RULE_STATUS_TYPE.AWAITING_APPROVAL)
    } else {
      condLog(`There are no actions in the action queues`, funcName, fileName, area)
      this.setStatus(RULE_STATUS_TYPE.AWAITING_EVALUATION)
      this.setSilentEvaluate()
    }

    exitLog(funcName, fileName, area)
    return
  }

  start(): void {
    const funcName = 'start'
    entryLog(funcName, fileName, area)

    if (this.evaluateRule) {
      condExitLog(`Rule is requiring evaluation - skip`, funcName, fileName, area)
      return
    }

    if (this.disabled) {
      condExitLog(`Rule is disabled - skip`, funcName, fileName, area)
      return
    }

    if (!this.enableStartStopActions) {
      condExitLog(`Rule does not have enableStartStopActions set - skip`, funcName, fileName, area)
      return
    }

    if (this.status !== RULE_STATUS_TYPE.AWAITING_APPROVAL) {
      condExitLog(`Rule is not awaiting approval - skip`, funcName, fileName, area)
      return
    }

    if (this.startActions) {
      condExitLog(`startActions is already true - skip`, funcName, fileName, area)
      return
    }

    this.setStartActions(true)
    this.setStatus(RULE_STATUS_TYPE.QUEUED_ACTIONS)

    exitLog(funcName, fileName, area)
    return
  }
}
