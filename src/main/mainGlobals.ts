import { PromiseResolveRejectTimer, PromiseResolveTimer } from '@shared-node/utils/promise'

export class MainGlobals {
  /* Global useful data for main */
  // Utility process of worker
  workerProcess: Electron.UtilityProcess | undefined = undefined
  // Port to worker process
  workerPort: Electron.MessagePortMain | undefined = undefined
  // Is worker process setup?
  workerSetup = false

  /* Resolving promises */
  // Map for resolving normal SyncIpcMessages
  awaitingIpcMessages = new Map<string, PromiseResolveRejectTimer>()
  // Map for resolving sleeps
  currentSleeps = new Map<string, PromiseResolveTimer>()
}

export default MainGlobals
