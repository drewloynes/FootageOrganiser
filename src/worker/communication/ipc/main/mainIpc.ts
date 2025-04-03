import { Settings } from '@shared/settings/settings'
import { IpcMessage } from '@shared/utils/ipc'
import { endSleepEarly } from '@shared/utils/timer'
import { RuleStatus } from '@worker/rules/ruleStatus'
import { Input } from 'postcss'

const fileName: string = 'mainIpc.ts'
const area: string = 'ipc'

// Setup IPC to the 'main' process of electron
export function setupMainIpc(): void {
  const funcName: string = 'setupMainIpc'
  entryLog(funcName, fileName, area)

  // Wait to receive a message from main with port information
  process.parentPort.on('message', (e) => {
    ipcRecLog('Main->Worker Initial Port Handover Message', funcName, fileName, area)
    const [port]: Electron.MessagePortMain[] = e.ports
    workerConfig.setMainPort(port)
    infoLog('Port WorkerPrcoess->MainProcess Established', funcName, fileName, area)
    // Setup main IPC callback events
    setupMainIpcEvents()
  })

  exitLog(funcName, fileName, area)
  return
}

// Setup event callbacks for main process
function setupMainIpcEvents(): void {
  const funcName: string = 'setupMainIpcEvents'
  entryLog(funcName, fileName, area)

  const mainPort: Electron.MessagePortMain | undefined = workerConfig.getMainPort()
  if (mainPort) {
    mainPort.on('message', async (e) => {
      ipcRecLog('Main->Worker Message', funcName, fileName, area)
      await receiveMainMessage(e.data)
    })
    mainPort.on('close', () => {
      warnLog('Main->Worker Worker Port Closed', funcName, fileName, area)
    })
  } else {
    errorLog(`mainPort didn't exist`, funcName, fileName, area)
    throw `mainPort should exist but doesn't`
  }

  exitLog(funcName, fileName, area)
  return
}

// Parse the message ID and perform function
async function receiveMainMessage(message: IpcMessage): Promise<void> {
  const funcName: string = 'receiveMainMessage'
  entryLog(funcName, fileName, area)

  switch (message.id) {
    case 'alive': {
      condLog('Received alive ICP message from main process', funcName, fileName, area)
      break
    }
    case 'storage-location': {
      condLog('Received storage-location ICP message from main process', funcName, fileName, area)
      storageLocation = message.data as string
      break
    }
    case 'rule-changed': {
      condLog('Received alive ICP message from main process', funcName, fileName, area)
      workerConfig.getInputQueues().ruleChanged(message.data as string)
      endSleepEarly()
      break
    }
    case 'rule-added': {
      condLog('Received alive ICP message from main process', funcName, fileName, area)
      workerConfig.getInputQueues().ruleAdded(message.data as string)
      endSleepEarly()
      break
    }
    case 'rule-deleted': {
      condLog('Received alive ICP message from main process', funcName, fileName, area)
      workerConfig.getInputQueues().ruleDeleted(message.data as string)
      break
    }
    case 'all-rules-changed': {
      condLog('Received all-rule-changed from main process', funcName, fileName, area)
      workerConfig.getInputQueues().allRulesChanged()
      endSleepEarly()
      break
    }
    case 'start-rule': {
      condLog('Received alive ICP message from main process', funcName, fileName, area)
      workerConfig.getInputQueues().startRule(message.data as string)
      endSleepEarly()
      break
    }
    case 'stop-rule': {
      condLog('Received alive ICP message from main process', funcName, fileName, area)
      workerConfig.getInputQueues().stopRule(message.data as string)
      endSleepEarly()
      break
    }
    case 'settings-changed': {
      condLog('Received alive ICP message from main process', funcName, fileName, area)
      await footageOrganiserSettings.changed()
      endSleepEarly()
      break
    }
    case 'rule-status': {
      condLog('Received alive ICP message from main process', funcName, fileName, area)
      RuleStatus.sendCurrentRuleStatus(
        message.data.requestId as string,
        message.data.name as string
      )
      break
    }
    case 'rule-status-all': {
      condLog('Received alive ICP message from main process', funcName, fileName, area)
      RuleStatus.sendAllCurrentRuleStatus(message.data.requestId as string)
      break
    }
    default: {
      condLog('Received ICP message could not be identified by worker', funcName, fileName, area)
      break
    }
  }

  exitLog(funcName, fileName, area)
  return
}
