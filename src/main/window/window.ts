import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell } from 'electron'
import { join } from 'path'

const fileName: string = 'window.ts'
const area: string = 'window'

export function getWindow(): Electron.BrowserWindow | undefined {
  const funcName: string = 'getWindow'
  entryLog(funcName, fileName, area)

  const foundWindow = BrowserWindow.getAllWindows().find(
    (window) => window.title === 'Footage Organiser'
  )

  exitLog(funcName, fileName, area)
  return foundWindow
}

export function openWindow(): void {
  const funcName: string = 'openMainWindow'
  entryLog(funcName, fileName, area)

  const window = getWindow()
  if (window) {
    condLog(`Window already exists - Show it`, funcName, fileName, area)
    window.show()
  } else {
    condLog(`Window doesn't currently exist`, funcName, fileName, area)
    createWindow()
  }

  exitLog(funcName, fileName, area)
  return
}

function createWindow(): void {
  const funcName: string = 'createWindow'
  entryLog(funcName, fileName, area)

  new BrowserWindow({
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
    webPreferences: {
      preload: join(__dirname, '../preload/preload.cjs'),
      sandbox: true,
      contextIsolation: true
    }
  })

  windowModifications()
  setupWindowCallbacks()

  if (is.dev) {
    condLog(`In dev mode`, funcName, fileName, area)
    devModeWindowModifications()
  }

  exitLog(funcName, fileName, area)
  return
}

function windowModifications(): void {
  const funcName: string = 'windowModifications'
  entryLog(funcName, fileName, area)

  // Forces external links to open througn default browser
  getWindow()?.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  exitLog(funcName, fileName, area)
  return
}

function setupWindowCallbacks(): void {
  const funcName: string = 'setupWindowCallbacks'
  entryLog(funcName, fileName, area)

  getWindow()?.on('ready-to-show', () => {
    getWindow()?.show()
  })

  exitLog(funcName, fileName, area)
  return
}

function devModeWindowModifications(): void {
  const funcName: string = 'devModeWindowModifications'
  entryLog(funcName, fileName, area)

  // Adds two error logs but doesnt break any functionality so they aren't fixing:
  // https://github.com/electron/electron/issues/41614
  getWindow()?.webContents.openDevTools()

  // Renderer base on electron-vite cli changes
  // Load the remote URL for development or the local html file for production.
  if (process.env['ELECTRON_RENDERER_URL']) {
    getWindow()?.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    getWindow()?.loadFile(join(__dirname, '../renderer/index.html'))
  }

  exitLog(funcName, fileName, area)
  return
}
