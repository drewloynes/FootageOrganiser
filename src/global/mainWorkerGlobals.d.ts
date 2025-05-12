// Declare globals for main and worker processes
// (They share the same namespace due to electron reasons)

import MainGlobals from '@main/mainGlobals'
import WorkerGlobals from '@worker/workerGlobals'

// Make file a module so declarations can be properly scoped and merged into global type space
export {}

declare global {
  // Decalare logging functions as true globals
  function entryLog(funcName: string, fileName: string, area?: string): void
  function exitLog(funcName: string, fileName: string, area?: string): void
  function condLog(description: string, funcName: string, fileName: string, area?: string): void
  function condExitLog(description: string, funcName: string, fileName: string, area?: string): void
  function errorLog(description: string, funcName: string, fileName: string, area?: string): void
  function errorExitLog(
    description: string,
    funcName: string,
    fileName: string,
    area?: string
  ): void
  function warnLog(description: string, funcName: string, fileName: string, area?: string): void
  function warnExitLog(description: string, funcName: string, fileName: string, area?: string): void
  function infoLog(description: string, funcName: string, fileName: string, area?: string): void
  function debugLog(description: string, funcName: string, fileName: string, area?: string): void
  function debugExitLog(
    description: string,
    funcName: string,
    fileName: string,
    area?: string
  ): void

  function ipcRecLog(description: string, funcName: string, fileName: string, area?: string): void
  function ipcSentLog(description: string, funcName: string, fileName: string, area?: string): void

  // eslint-disable-next-line no-var
  var glob: NodeJS.Global & typeof globalThis

  const FOOTAGE_ORGANISER_VERSION: string

  // Declare under the global keyword
  namespace NodeJS {
    interface Global {
      // Name of process - Used when logging
      processName: string

      // Main Globals (Only available in the main process)
      mainGlobals: MainGlobals

      // Worker Globals (Only available in the worker process)
      workerGlobals: WorkerGlobals
    }
  }
}
