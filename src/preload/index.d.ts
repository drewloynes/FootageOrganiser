import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    electron: { openDirectory: any }
  }
}
