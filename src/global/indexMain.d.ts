import { entryLog } from '@shared/debug/logger'
import WorkerConfig from '@worker/workerConfig'

declare global {
  function entryLog(funcName: string, fileName: string, area?: string)
  function exitLog(funcName: string, fileName: string, area?: string)
  function condLog(description: string, funcName: string, fileName: string, area?: string)
  function errorLog(description: string, funcName: string, fileName: string, area?: string)
  function warnLog(description: string, funcName: string, fileName: string, area?: string)
  function infoLog(description: string, funcName: string, fileName: string, area?: string)
  function debugLog(description: string, funcName: string, fileName: string, area?: string)
  function ipcRecLog(description: string, funcName: string, fileName: string, area?: string)
  function ipcSentLog(description: string, funcName: string, fileName: string, area?: string)
  // Worker config only available in worker process!!
  // Var needed otherwise I run into type problems in the init functions with LSP - TODO Needs fixing properly
  // eslint-disable-next-line no-var
  var workerConfig: WorkerConfig
  // eslint-disable-next-line no-var
  var processName: string
  // eslint-disable-next-line no-var
  var workerPrcoess: Electron.UtilityProcess | undefined
}
