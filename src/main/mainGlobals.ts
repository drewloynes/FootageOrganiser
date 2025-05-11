import { PromiseResolveRejectTimer, PromiseResolveTimer } from '@shared/utils/promise'

export class MainGlobals {
  /* Global useful data for main */
  // Utility process of worker
  workerPrcoess: Electron.UtilityProcess | undefined = undefined
  // Port to worker process
  workerPort: Electron.MessagePortMain | undefined = undefined

  /* Resolving promises */
  // Map for resolving normal SyncIpcMessages
  awaitingIpcMessages: Map<string, PromiseResolveRejectTimer> = new Map()
  // Map for resolving sleeps
  currentSleeps: Map<string, PromiseResolveTimer> = new Map()
}

export default MainGlobals
