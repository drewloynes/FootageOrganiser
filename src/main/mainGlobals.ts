import { PromiseResolveRejectTimer, PromiseResolveTimer } from '@shared/utils/promise'

const fileName: string = 'mainGlobals.ts'
const area: string = 'main'

export class MainGlobals {
  /* Global useful data for main */
  // Utility process of worker
  workerPrcoess: Electron.UtilityProcess | undefined
  // Port to worker process
  workerPort: Electron.MessagePortMain | undefined

  /* Resolving promises */
  // Map for resolving normal SyncIpcMessages
  awaitingIpcMessages: Map<string, PromiseResolveRejectTimer>
  // Map for resolving sleeps
  currentSleeps: Map<string, PromiseResolveTimer>

  constructor() {
    const funcName: string = 'MainGlobals Constructor'
    entryLog(funcName, fileName, area)

    this.workerPrcoess = undefined
    this.workerPort = undefined

    this.awaitingIpcMessages = new Map()
    this.currentSleeps = new Map()

    exitLog(funcName, fileName, area)
    return
  }
}

export default MainGlobals
