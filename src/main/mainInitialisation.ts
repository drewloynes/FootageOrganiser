import * as logger from '@shared/debug/logger'
import MainGlobals from './mainGlobals'

export function initMainGlobals(): void {
  // Setup loggers first

  // Init glob keyword
  global.glob = global as NodeJS.Global & typeof globalThis

  // Set up logs
  global.entryLog = logger.entryLog
  global.exitLog = logger.exitLog
  global.condLog = logger.condLog
  global.condExitLog = logger.condExitLog
  global.errorLog = logger.errorLog
  global.errorExitLog = logger.errorExitLog
  global.warnLog = logger.warnLog
  global.warnExitLog = logger.warnExitLog
  global.infoLog = logger.infoLog
  global.debugLog = logger.debugLog
  global.debugExitLog = logger.debugExitLog
  global.ipcRecLog = logger.ipcRecLog
  global.ipcSentLog = logger.ipcSentLog
  global.processName = 'main'

  // Setup the worker's globals
  global.mainGlobals = new MainGlobals()

  // No exit log as there was no entry
}

export default initMainGlobals
