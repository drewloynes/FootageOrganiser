import { StoreSettings } from '@shared-all/types/settingsTypes'
import { STORE_SETTINGS_ZOD_SCHEMA } from '@shared-all/validation/validateSettings'
import { sendAsyncIpcMessageWorker, sendSyncIpcMessageWorker } from '../ipc/worker/workerIpcSender'

const fileName = 'settingsWindowCallback.ts'
const area = 'settings'

export function modifySettings(newSettings: StoreSettings): void {
  const funcName = 'modifySettings'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  if (STORE_SETTINGS_ZOD_SCHEMA.safeParse(newSettings).success) {
    condLog('Settings are valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('modify-settings', newSettings)
  }

  exitLog(funcName, fileName, area)
  return
}

export async function getSettings(): Promise<StoreSettings | undefined> {
  const funcName = 'getSettings'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return undefined
  }

  const settings: StoreSettings | undefined = (await sendSyncIpcMessageWorker(
    'get-settings',
    {}
  )) as StoreSettings | undefined

  exitLog(funcName, fileName, area)
  return settings
}
