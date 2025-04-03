import { CopyPaths, Rule } from '@shared/rules/rule'
import {
  sendRuleStatus,
  sendRuleStatusAll,
  sendRuleStatusList
} from '@worker/communication/ipc/main/mainIpcSender'

const fileName: string = 'ruleStatus.ts'
const area: string = 'rule'

export enum StatusType {
  UNKNOWN = 'Unknown',
  PROCESSING = 'Processing',
  AWAITING_PROCESSING = 'Awaiting-Processing',
  AWAITING_APPROVAL = 'Awaitng-Approval',
  QUEUED_ACTIONS = 'Queued-Actions',
  ACTIONING = 'Actioning',
  NO_WORK = 'No-Work',
  PAUSED = 'Paused'
}

export class RuleStatus {
  private name: string
  private status: StatusType
  private fileCopyWaitingApproval: CopyPaths[]
  private fileDeleteWaitingApproval: string[]
  private dirCreateWaitingApproval: string[]
  private dirDeleteWaitingApproval: string[]

  constructor(
    name: string,
    status: StatusType = StatusType.UNKNOWN,
    fileCopyWaitingApproval: CopyPaths[] = [],
    fileDeleteWaitingApproval: string[] = [],
    dirCreateWaitingApproval: string[] = [],
    dirDeleteWaitingApproval: string[] = []
  ) {
    const funcName = 'RuleStatus Constructor'
    entryLog(funcName, fileName, area)

    this.name = name
    this.status = status
    this.fileCopyWaitingApproval = fileCopyWaitingApproval
    this.fileDeleteWaitingApproval = fileDeleteWaitingApproval
    this.dirCreateWaitingApproval = dirCreateWaitingApproval
    this.dirDeleteWaitingApproval = dirDeleteWaitingApproval

    exitLog(funcName, fileName, area)
    return
  }

  static initialiseRuleStatusList(ruleList: Rule[]) {
    const funcName = 'initialiseRuleStatusList'
    entryLog(funcName, fileName, area)

    const ruleStatusList: RuleStatus[] = []
    for (const rule of ruleList) {
      let newRuleStatus: RuleStatus
      if (rule.getPauseProcessing()) {
        newRuleStatus = new RuleStatus(rule.getName(), StatusType.PAUSED)
      } else {
        newRuleStatus = new RuleStatus(rule.getName(), StatusType.AWAITING_PROCESSING)
      }
      ruleStatusList.push(newRuleStatus)
    }
    workerConfig.setRuleStatusList(ruleStatusList)

    exitLog(funcName, fileName, area)
    return
  }

  static UpdatedRulesUpdRuleStatusList(newRuleList: Rule[]) {
    const funcName = 'UpdatedRulesUpdRuleStatusList'
    entryLog(funcName, fileName, area)

    const newRuleStatusList: RuleStatus[] = []
    const currentRuleStatusList: RuleStatus[] = workerConfig.getRuleStatusList()
    for (const rule of newRuleList) {
      let newRuleStatus: RuleStatus
      const currentRuleStatus = currentRuleStatusList.find(
        (ruleStatus) => ruleStatus.name === rule.getName()
      )
      if (currentRuleStatus) {
        newRuleStatus = currentRuleStatus
        if (currentRuleStatus.status === StatusType.PAUSED && rule.getPauseProcessing() === false) {
          newRuleStatus.status = StatusType.AWAITING_PROCESSING
        }
      } else {
        if (rule.getPauseProcessing()) {
          newRuleStatus = new RuleStatus(rule.getName(), StatusType.PAUSED)
        } else {
          newRuleStatus = new RuleStatus(rule.getName(), StatusType.AWAITING_PROCESSING)
        }
      }
      newRuleStatusList.push(newRuleStatus)
    }
    workerConfig.setRuleStatusList(newRuleStatusList)

    exitLog(funcName, fileName, area)
    return
  }

  static resetRuleStatusList(ruleList: Rule[]) {
    const funcName = 'resetRuleStatusList'
    entryLog(funcName, fileName, area)

    const newRuleStatusList: RuleStatus[] = []
    for (const newRuleStatus of workerConfig.getRuleStatusList()) {
      newRuleStatus.dirCreateWaitingApproval = []
      newRuleStatus.dirDeleteWaitingApproval = []
      newRuleStatus.fileCopyWaitingApproval = []
      newRuleStatus.fileDeleteWaitingApproval = []

      const foundRule = ruleList.find((rule) => rule.getName() === newRuleStatus.name)
      if (foundRule) {
        if (foundRule.getPauseProcessing() === false) {
          newRuleStatus.status = StatusType.AWAITING_PROCESSING
        }
      } else {
        errorLog('Rule not found when it should be', funcName, fileName, area)
      }

      newRuleStatusList.push(newRuleStatus)
    }
    workerConfig.setRuleStatusList(newRuleStatusList)

    exitLog(funcName, fileName, area)
    return
  }

  static setRuleStatusInList(rule: Rule, status: StatusType) {
    const funcName = 'UpdatedRulesUpdRuleStatusList'
    entryLog(funcName, fileName, area)

    const ruleStatus = workerConfig
      .getRuleStatusList()
      .find((ruleStatus) => ruleStatus.name === rule.getName())
    if (ruleStatus) {
      ruleStatus.status = status
    } else {
      errorLog(`Could not find RuleStatus for ${rule.getName()}`, funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return
  }

  static setRuleStatusPendingWorkInList(rule: Rule) {
    const funcName = 'setRuleStatusPendingWorkInList'
    entryLog(funcName, fileName, area)

    const ruleStatus = workerConfig
      .getRuleStatusList()
      .find((ruleStatus) => ruleStatus.name === rule.getName())
    if (ruleStatus) {
      ruleStatus.fileCopyWaitingApproval = rule.getFileCopyActionQueue()
      ruleStatus.fileDeleteWaitingApproval = rule.getFileDeleteActionQueue()
      ruleStatus.dirCreateWaitingApproval = rule.getDirMakeActionQueue()
      ruleStatus.dirDeleteWaitingApproval = rule.getDirDeleteActionQueue()
    } else {
      errorLog(`Could not find RuleStatus for ${rule.getName()}`, funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return
  }

  static emptyRuleStatusPendingWorkInList(rule: Rule) {
    const funcName = 'emptyRuleStatusPendingWorkInList'
    entryLog(funcName, fileName, area)

    const ruleStatus = workerConfig
      .getRuleStatusList()
      .find((ruleStatus) => ruleStatus.name === rule.getName())
    if (ruleStatus) {
      ruleStatus.fileCopyWaitingApproval = []
      ruleStatus.fileDeleteWaitingApproval = []
      ruleStatus.dirCreateWaitingApproval = []
      ruleStatus.dirDeleteWaitingApproval = []
    } else {
      errorLog(`Could not find RuleStatus for ${rule.getName()}`, funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return
  }

  static setRuleStatusAwaitingApproval(rule: Rule) {
    const funcName = 'setRuleStatusAwaitingApproval'
    entryLog(funcName, fileName, area)

    if (rule.getStartActions()) {
      this.setRuleStatusInList(rule, StatusType.AWAITING_APPROVAL)
      this.setRuleStatusPendingWorkInList(rule)
    }

    exitLog(funcName, fileName, area)
    return
  }

  static sendCurrentRuleStatusList() {
    const funcName = 'sendCurrentRuleStatusList'
    entryLog(funcName, fileName, area)

    const currentRuleStatusList = workerConfig.getRuleStatusList()
    const numOfArrayItemToSend = 1000
    const newRuleStatusList: RuleStatus[] = []
    for (const currentRuleStatus of currentRuleStatusList) {
      const newRuleStatus = new RuleStatus(
        currentRuleStatus.name,
        currentRuleStatus.status,
        currentRuleStatus.fileCopyWaitingApproval.slice(0, numOfArrayItemToSend),
        currentRuleStatus.fileDeleteWaitingApproval.slice(0, numOfArrayItemToSend),
        currentRuleStatus.dirCreateWaitingApproval.slice(0, numOfArrayItemToSend),
        currentRuleStatus.dirDeleteWaitingApproval.slice(0, numOfArrayItemToSend)
      )
      newRuleStatusList.push(newRuleStatus)
    }
    sendRuleStatusAll(newRuleStatusList)

    exitLog(funcName, fileName, area)
    return
  }

  static sendCurrentRuleStatus(requestId, name) {
    const funcName = 'sendCurrentRuleStatus'
    entryLog(funcName, fileName, area)

    const currentRuleStatusList = workerConfig.getRuleStatusList()
    const currentRuleStatus = currentRuleStatusList.find((ruleStatus) => ruleStatus.name === name)
    const numOfArrayItemToSend = 1000
    let newRuleStatus: object = {}
    if (currentRuleStatus) {
      newRuleStatus = {
        requestId: requestId,
        name: currentRuleStatus.name,
        status: currentRuleStatus.status,
        fileCopyWaitingApproval: currentRuleStatus.fileCopyWaitingApproval.slice(
          0,
          numOfArrayItemToSend
        ),
        fileDeleteWaitingApproval: currentRuleStatus.fileDeleteWaitingApproval.slice(
          0,
          numOfArrayItemToSend
        ),
        dirCreateWaitingApproval: currentRuleStatus.dirCreateWaitingApproval.slice(
          0,
          numOfArrayItemToSend
        ),
        dirDeleteWaitingApproval: currentRuleStatus.dirDeleteWaitingApproval.slice(
          0,
          numOfArrayItemToSend
        )
      }
    }
    sendRuleStatus(newRuleStatus)

    exitLog(funcName, fileName, area)
    return
  }

  static sendAllCurrentRuleStatus(requestId) {
    const funcName = 'sendAllCurrentRuleStatus'
    entryLog(funcName, fileName, area)

    const currentRuleStatusList = workerConfig.getRuleStatusList()
    let newRuleStatusAll: object = {}
    if (currentRuleStatusList) {
      newRuleStatusAll = {
        requestId: requestId,
        ruleStatusList: RuleStatus.fixRuleStatusList(currentRuleStatusList)
      }
    }
    sendRuleStatusAll(newRuleStatusAll)

    exitLog(funcName, fileName, area)
    return
  }

  static fixRuleStatusList(originalRuleStatusList: RuleStatus[]) {
    const funcName = 'fixRuleStatusList'
    entryLog(funcName, fileName, area)

    const fixedRuleStatusList: object[] = []
    const numOfArrayItemToSend = 1000

    for (const ruleStatus of originalRuleStatusList) {
      const fixedRuleStatus = {
        name: ruleStatus.name,
        status: ruleStatus.status,
        fileCopyWaitingApproval: ruleStatus.fileCopyWaitingApproval.slice(0, numOfArrayItemToSend),
        fileDeleteWaitingApproval: ruleStatus.fileDeleteWaitingApproval.slice(
          0,
          numOfArrayItemToSend
        ),
        dirCreateWaitingApproval: ruleStatus.dirCreateWaitingApproval.slice(
          0,
          numOfArrayItemToSend
        ),
        dirDeleteWaitingApproval: ruleStatus.dirDeleteWaitingApproval.slice(0, numOfArrayItemToSend)
      }
      fixedRuleStatusList.push(fixedRuleStatus)
    }

    exitLog(funcName, fileName, area)
    return fixedRuleStatusList
  }
}
