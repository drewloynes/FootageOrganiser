const { contextBridge, ipcRenderer } = require('electron')

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

// Use `contextBridge` APIs to expose Electron APIs to renderer.
try {
  contextBridge.exposeInMainWorld('electron', {
    openDirectory: () => ipcRenderer.invoke('dialog:openDirectory')
  })
} catch (error) {
  console.error(error)
}
