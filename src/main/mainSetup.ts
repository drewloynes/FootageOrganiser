import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, Menu, Tray } from 'electron'
import { join } from 'path'
import { setupWindowIpc } from './ipc/window/windowIpcSetup'
import { openWindow } from './window/window'
import setupWorkerProcess from './worker/workerProcess'
import { stopAllStreams } from './worker/workerUtils'

const fileName: string = 'mainSetup.ts'
const area: string = 'main'

export function setupMain(): void {
  const funcName: string = 'setupMain'
  entryLog(funcName, fileName, area)

  const supportedPlatforms: string[] = ['win32', 'darwin']
  // eslint-disable-next-line no-constant-condition
  if (!supportedPlatforms.includes(process.platform)) {
    condLog(`Platform ${process.platform} not supported`, funcName, fileName, area)
    app.quit()
  }

  // Setup all callbacks for electron app

  // Called when Electron has finished initialization
  app.on('ready', ready)

  // Called when Electron creates a browser window
  app.on('browser-window-created', browserWindowCreated)

  // Mac OS Only
  // Emitted when the application is activated. Various actions can trigger this event,
  // such as launching the application for the first time, attempting to re-launch the
  // application when it's already running, or clicking on the application's
  // dock or taskbar icon.
  app.on('activate', activate)

  // Do not quit when all windows clsoed - Allow the app to run in the background
  app.on('window-all-closed', windowAllClosed)

  // Called after app quitting function is called
  app.on('before-quit', beforeQuit)

  exitLog(funcName, fileName, area)
  return
}

async function ready() {
  const funcName: string = 'ready'
  entryLog(funcName, fileName, area)

  // Windows: Set Application User Model ID
  electronApp.setAppUserModelId('com.footage-organiser')

  const tray = new Tray(join(__dirname, '../../resources/Wario.png'))
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Open', click: openWindow },
      { label: 'Quit', click: app.quit }
    ])
  )
  tray.setToolTip('Footage Organiser')
  tray.on('click', () => openWindow())

  await setupWorkerProcess()
  setupWindowIpc()

  // Open window after app is fully setup
  openWindow()

  exitLog(funcName, fileName, area)
  return
}

function browserWindowCreated(_, window) {
  const funcName: string = 'browserWindowCreated'
  entryLog(funcName, fileName, area)

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  optimizer.watchWindowShortcuts(window)

  exitLog(funcName, fileName, area)
  return
}

function activate() {
  const funcName: string = 'activate'
  entryLog(funcName, fileName, area)

  // Create a window in the app when the dock icon is clicked and no other windows are open.
  if (BrowserWindow.getAllWindows().length === 0) {
    condLog(`No windows open`, funcName, fileName, area)
    openWindow()
  }

  exitLog(funcName, fileName, area)
  return
}

function windowAllClosed() {
  const funcName: string = 'windowAllClosed'
  entryLog(funcName, fileName, area)

  // Keep the app running
  stopAllStreams()

  exitLog(funcName, fileName, area)
  return
}

function beforeQuit(): void {
  const funcName: string = 'beforeQuit'
  entryLog(funcName, fileName, area)

  if (glob.mainGlobals.workerPrcoess) {
    condLog(`Worker process exists - kill it`, funcName, fileName, area)
    glob.mainGlobals.workerPrcoess.kill()
  }

  exitLog(funcName, fileName, area)
  return
}
