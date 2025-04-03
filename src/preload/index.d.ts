/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    electron: {
      chooseDirectory: any
      addCopyFileRule: any
      addMirrorRule: any
      deleteRule: any
      modifyCopyFileRule: any
      modifyMirrorRule: any
      getRule: any
      getRules: any
      pauseRule: any
      unpauseRule: any
      pauseAllRules: any
      startRule: any
      stopRule: any
      stopAllRules: any
      getSettings: any
      updateSettings: any
      openLogsFolder: any
      quitFootageOrganiser: any
    }
  }
}
