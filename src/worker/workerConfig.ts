import { InputQueue } from './communication/ipc/inputQueue'
import { RuleStatus } from './rules/ruleStatus'

const fileName: string = 'workerConfig.ts'
const area: string = 'worker'

export class WorkerConfig {
  // Port to main process
  private mainPort: Electron.MessagePortMain | undefined
  // InputQueues - Work to do from external inputs
  private inputQueues: InputQueue
  // Rules Status - List of status of each of the rules
  private ruleStatusList: RuleStatus[]

  constructor() {
    const funcName: string = 'workerConfig Constructor'
    entryLog(funcName, fileName, area)

    this.inputQueues = new InputQueue()
    this.ruleStatusList = []

    exitLog(funcName, fileName, area)
    return
  }

  /* mainPort Functions */

  setMainPort(port: Electron.MessagePortMain): void {
    const funcName: string = 'setMainPort'
    entryLog(funcName, fileName, area)

    this.mainPort = port

    exitLog(funcName, fileName, area)
    return
  }

  getMainPort(): Electron.MessagePortMain | undefined {
    const funcName: string = 'getMainPort'
    entryLog(funcName, fileName, area)

    if (!this.mainPort) {
      warnLog('mainPort is undefined', funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return this.mainPort
  }

  /* intputQueues Functions */

  setInputQueues(inputQueue: InputQueue): void {
    const funcName: string = 'setInputQueues'
    entryLog(funcName, fileName, area)

    this.inputQueues = inputQueue

    exitLog(funcName, fileName, area)
    return
  }

  getInputQueues(): InputQueue {
    const funcName: string = 'getInputQueues'
    entryLog(funcName, fileName, area)

    if (!this.inputQueues) {
      warnLog('inputQueues is undefined', funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return this.inputQueues
  }

  /* ruleStatusList Functions */

  setRuleStatusList(ruleStatusList: RuleStatus[]): void {
    const funcName: string = 'setRuleStatusList'
    entryLog(funcName, fileName, area)

    this.ruleStatusList = ruleStatusList

    exitLog(funcName, fileName, area)
    return
  }

  getRuleStatusList(): RuleStatus[] {
    const funcName: string = 'getRuleStatusList'
    entryLog(funcName, fileName, area)

    if (!this.ruleStatusList) {
      warnLog('ruleStatusList is undefined', funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return this.ruleStatusList
  }
}

export default WorkerConfig
