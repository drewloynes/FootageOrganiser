import * as logger from '@shared/debug/logger'
import { Settings } from '@shared/settings/settings'
import WorkerConfig from '@worker/workerConfig'

export function initWorkerGlobals(): void {
  // Setup loggers first - lets start logging!!!

  global.entryLog = logger.entryLog
  global.exitLog = logger.exitLog
  global.condLog = logger.condLog
  global.errorLog = logger.errorLog
  global.warnLog = logger.warnLog
  global.infoLog = logger.infoLog
  global.debugLog = logger.debugLog
  global.ipcRecLog = logger.ipcRecLog
  global.ipcSentLog = logger.ipcSentLog
  global.processName = 'WorkerProc'

  global.footageOrganiserSettings = undefined

  global.currentDriveInfo = undefined

  global.storageLocation = undefined

  // Need worker config accessible globally
  global.workerConfig = new WorkerConfig()

  global.currentRunningTimeoutsAndResolve = new Map()

  // No exit log as there was no entry!
}

export default initWorkerGlobals
