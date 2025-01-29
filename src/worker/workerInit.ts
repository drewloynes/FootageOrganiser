import * as logger from '@shared/debug/logger'
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
  // Make workerConfig global
  global.workerConfig = new WorkerConfig()
  // No exit log as there was no entry!
}

export default initWorkerGlobals
