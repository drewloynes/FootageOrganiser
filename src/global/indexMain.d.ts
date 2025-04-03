import { entryLog } from '@shared/debug/logger'
import { DriveInfo } from '@shared/drives/driveInfo'
import WorkerConfig from '@worker/workerConfig'

declare global {
  // For main and worker process
  function entryLog(funcName: string, fileName: string, area?: string)
  function exitLog(funcName: string, fileName: string, area?: string)
  function condLog(description: string, funcName: string, fileName: string, area?: string)
  function errorLog(description: string, funcName: string, fileName: string, area?: string)
  function warnLog(description: string, funcName: string, fileName: string, area?: string)
  function infoLog(description: string, funcName: string, fileName: string, area?: string)
  function debugLog(description: string, funcName: string, fileName: string, area?: string)
  function ipcRecLog(description: string, funcName: string, fileName: string, area?: string)
  function ipcSentLog(description: string, funcName: string, fileName: string, area?: string)
  let processName: string

  // Settings for all
  let footageOrganiserSettings: Settings | undefined

  // Current Drive Info
  let currentDriveInfo: DriveInfo[] | undefined

  // Port to worker process
  let workerPort: Electron.MessagePortMain | undefined

  //
  let storageLocation: string | undefined

  let currentRunningTimeoutsAndResolve: Map

  let ruleStatusPendingRequests: Map
  let ruleStatusAllPendingRequests: Map

  // Only available in worker process!!
  // eslint-disable-next-line no-var
  let workerConfig: WorkerConfig

  // Only available in main process!!
  // eslint-disable-next-line no-var
  const workerPrcoess: Electron.UtilityProcess | undefined = undefined
}
