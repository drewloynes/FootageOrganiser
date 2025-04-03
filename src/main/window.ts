import { shell, BrowserWindow, dialog } from 'electron'
import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

const fileName: string = 'window.ts'
const area: string = 'window'

function createWindow(): void {
  const funcName: string = 'createWindow'
  entryLog(funcName, fileName, area)

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    center: true,
    title: 'Footage Organiser',
    frame: false,
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#eff0f5',
      symbolColor: '#000000'
    },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/preload.cjs'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev) {
    // Adds two error logs but doesnt break any functionality so they aren't fixing:
    // https://github.com/electron/electron/issues/41614
    mainWindow.webContents.openDevTools()
  }

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  exitLog(funcName, fileName, area)
  return
}

export function getMainWindow(): Electron.BrowserWindow | undefined {
  const funcName: string = 'getMainWindow'
  entryLog(funcName, fileName, area)

  const Windows: Electron.BrowserWindow[] = BrowserWindow.getAllWindows()
  let foundWindow: Electron.BrowserWindow | undefined = undefined
  for (const window of Windows) {
    condLog(`For window in list of windows`, funcName, fileName, area)
    if (window.title === 'Footage Organiser') {
      condLog(`Window is Footage Organiser`, funcName, fileName, area)
      foundWindow = window
    }
  }

  exitLog(funcName, fileName, area)
  return foundWindow
}

export function openMainWindow(): void {
  const funcName: string = 'openMainWindow'
  entryLog(funcName, fileName, area)

  const window = getMainWindow()
  if (typeof window === 'undefined') {
    condLog(`Window doesn't currently exist`, funcName, fileName, area)
    createWindow()
  } else {
    condLog(`Window already exists - Show it`, funcName, fileName, area)
    window.show()
  }

  exitLog(funcName, fileName, area)
  return
}
