import { is } from '@electron-toolkit/utils'
import icon from '@resources/footage-organiser-logo-3.png?asset'
import { BrowserWindow, shell } from 'electron'
import { join } from 'path'

const fileName = 'window.ts'
const area = 'window'

export function getWindow(): Electron.BrowserWindow | undefined {
  const funcName = 'getWindow'
  entryLog(funcName, fileName, area)

  const foundWindow = BrowserWindow.getAllWindows().find(
    (window) => window.title === 'Footage Organiser'
  )

  exitLog(funcName, fileName, area)
  return foundWindow
}

export async function openWindow(): Promise<void> {
  const funcName = 'openMainWindow'
  entryLog(funcName, fileName, area)

  const window = getWindow()
  if (window) {
    condLog(`Window already exists - Show it`, funcName, fileName, area)
    window.show()
  } else {
    condLog(`Window doesn't currently exist`, funcName, fileName, area)
    await createWindow()
  }

  exitLog(funcName, fileName, area)
  return
}

async function createWindow(): Promise<void> {
  const funcName = 'createWindow'
  entryLog(funcName, fileName, area)

  new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1150,
    minHeight: 600,
    icon: icon,
    show: true,
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
    await devModeWindowModifications()
  } else {
    condLog(`Not dev mode`, funcName, fileName, area)
    await getWindow()?.loadFile(join(__dirname, '../renderer/index.html'))
  }

  exitLog(funcName, fileName, area)
  return
}

function windowModifications(): void {
  const funcName = 'windowModifications'
  entryLog(funcName, fileName, area)

  // Forces external links to open through default browser
  getWindow()?.webContents.setWindowOpenHandler((details) => {
    void shell.openExternal(details.url)
    return { action: 'deny' }
  })

  exitLog(funcName, fileName, area)
  return
}

function setupWindowCallbacks(): void {
  const funcName = 'setupWindowCallbacks'
  entryLog(funcName, fileName, area)

  getWindow()?.on('ready-to-show', () => {
    getWindow()?.show()
  })

  exitLog(funcName, fileName, area)
  return
}

async function devModeWindowModifications(): Promise<void> {
  const funcName = 'devModeWindowModifications'
  entryLog(funcName, fileName, area)

  // Adds two error logs but doesnt break any functionality so they aren't fixing:
  // https://github.com/electron/electron/issues/41614
  getWindow()?.webContents.openDevTools()

  // Renderer base on electron-vite cli changes
  // Load the remote URL for development or the local html file for production.
  if (process.env['ELECTRON_RENDERER_URL']) {
    await getWindow()?.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    await getWindow()?.loadFile(join(__dirname, '../renderer/index.html'))
  }

  exitLog(funcName, fileName, area)
  return
}
