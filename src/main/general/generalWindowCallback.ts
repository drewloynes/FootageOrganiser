import { ShortPathInVolume } from '@shared-all/types/pathInVolumeTypes'
import { shell } from 'electron'
import { app, dialog } from 'electron/main'
import path from 'path'
import { sendSyncIpcMessageWorker } from '../ipc/worker/workerIpcSender'
import { getWindow } from '../window/window'

const fileName: string = 'generalWindowCallback.ts'
const area: string = 'general'

export async function chooseDirectory(): Promise<ShortPathInVolume | undefined> {
  const funcName: string = 'chooseDirectory'
  entryLog(funcName, fileName, area)

  let shortPathInVolume: ShortPathInVolume | undefined = undefined

  const window: Electron.BrowserWindow | undefined = getWindow()
  if (!window) {
    condExitLog(`Window not found`, funcName, fileName, area)
    return shortPathInVolume
  }

  const { canceled, filePaths } = await dialog.showOpenDialog(window, {
    properties: ['openDirectory']
  })
  if (canceled) {
    condExitLog(`Dialog was canceled`, funcName, fileName, area)
    return shortPathInVolume
  }

  shortPathInVolume = (await sendSyncIpcMessageWorker(
    'get-short-path-in-volume',
    filePaths[0]
  )) as ShortPathInVolume

  exitLog(funcName, fileName, area)
  return shortPathInVolume
}

export async function openLogsFolder(): Promise<void> {
  const funcName: string = 'openLogsFolder'
  entryLog(funcName, fileName, area)

  const logsPath = path.join(app.getPath('userData'), 'logs')
  await shell.openPath(logsPath).then((error) => {
    if (error) {
      errorLog('Problem opening logs folder', funcName, fileName, area)
    }
  })

  exitLog(funcName, fileName, area)
  return
}

export async function openGithub(): Promise<void> {
  const funcName: string = 'openGithub'
  entryLog(funcName, fileName, area)

  await shell.openExternal('https://github.com/drewloynes/FootageOrganiser')

  exitLog(funcName, fileName, area)
  return
}

export async function openReportBug(): Promise<void> {
  const funcName: string = 'openReportBug'
  entryLog(funcName, fileName, area)

  await shell.openExternal('https://github.com/drewloynes/FootageOrganiser/issues/new')

  exitLog(funcName, fileName, area)
  return
}
