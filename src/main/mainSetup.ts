import { app, BrowserWindow, dialog, ipcMain, Menu, Tray } from 'electron'
import { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import createWorkerProcess from './worker/fork'
import { getMainWindow, openMainWindow } from './window'

const fileName: string = 'mainSetup.ts'
const area: string = 'main'

export function setupMain(): void {
  const funcName: string = 'setupMain'
  entryLog(funcName, fileName, area)

  debugLog('Setup all app callbacks', funcName, fileName, area)
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', appReady)
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', appBrowserWindowCreated)
  // MAC OS
  /* Emitted when the application is activated. Various actions can trigger this event, such as launching the application for the first time, attempting to re-launch the application when it's already running, or clicking on the application's dock or taskbar icon. */
  app.on('activate', appActivate)
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', appWindowAllClosed)
  //
  app.on('before-quit', appBeforeQuit)

  exitLog(funcName, fileName, area)
  return
}

function appReady() {
  const funcName: string = 'appReady'
  entryLog(funcName, fileName, area)

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  // Setup tray with context menu for when window is closed
  const tray = new Tray(join(__dirname, '../../resources/Wario.png')) // Path to your tray icon
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open App', click: openMainWindow },
    { label: 'Quit', click: app.quit }
  ])
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Footage Organiser')
  tray.on('click', () => openMainWindow())
  // Setup worker process
  createWorkerProcess()

  ipcMain.handle('dialog:openDirectory', handleFileOpen)

  // Open a window when app is ready
  openMainWindow()

  exitLog(funcName, fileName, area)
  return
}

async function handleFileOpen() {
  const window: Electron.BrowserWindow | undefined = getMainWindow()
  if (window) {
    const { canceled, filePaths } = await dialog.showOpenDialog(window, {
      properties: ['openDirectory']
    })
    if (!canceled) {
      return filePaths[0]
    }
  }
}

function appBrowserWindowCreated(_, window) {
  const funcName: string = 'appBrowserWindowCreated'
  entryLog(funcName, fileName, area)

  optimizer.watchWindowShortcuts(window)

  exitLog(funcName, fileName, area)
  return
}

function appActivate() {
  const funcName: string = 'appActivate'
  entryLog(funcName, fileName, area)

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) openMainWindow()

  exitLog(funcName, fileName, area)
  return
}

function appWindowAllClosed() {
  const funcName: string = 'appWindowAllClosed'
  entryLog(funcName, fileName, area)

  debugLog('Window Closed', funcName, fileName, area)

  exitLog(funcName, fileName, area)
  return
}

function appBeforeQuit(): void {
  const funcName: string = 'appBeforeQuit'
  entryLog(funcName, fileName, area)

  if (workerPrcoess) {
    condLog(`Worker process exists - kill it`, funcName, fileName, area)
    workerPrcoess.kill()
  }

  exitLog(funcName, fileName, area)
  return
}
