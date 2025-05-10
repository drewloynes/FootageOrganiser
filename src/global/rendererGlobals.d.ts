import { ClientLogger } from '@renderer/utils/debug/clientLogger'
import { Alert } from '@shared/types/alert'
import { ShortPathInVolume } from '@shared/types/pathInVolumeTypes'
import { FullRule, ShortRule, StoreRule } from '@shared/types/ruleTypes'
import { StoreSettings } from '@shared/types/settingsTypes'

// Make file a module so declarations can be properly scoped and merged into global type space
export {}

declare global {
  var log: ClientLogger

  const FOOTAGE_ORGANISER_VERSION: string

  interface Window {
    electron: {
      // Main -> Renderer async
      onAlert: (callback: (value: Alert) => void) => void
      removeListenerAlert: (callback: (value: Alert) => void) => void
      removeAllListenersAlert: () => void

      onAllRules: (callback: (value: ShortRule[]) => void) => void
      removeListenerAllRules: (callback: (value: ShortRule[]) => void) => void
      removeAllListenersAllRules: () => void

      onRule: (callback: (value: FullRule) => void) => void
      removeListenerRule: (callback: (value: FullRule) => void) => void
      removeAllListenersRule: () => void

      // Render -> Main async
      addRule: (newRule: StoreRule) => void
      modifyRule: (oldRuleName: string, newRule: StoreRule) => void
      deleteRule: (removeRuleName: string) => void
      startRule: (ruleName: string) => void
      stopRule: (ruleName: string) => void
      stopAllRules: () => void
      activateRule: (ruleName: string) => void
      disableRule: (ruleName: string) => void
      disableAllRules: () => void
      evaluateAllRules: () => void

      startRuleStream: (ruleName: string) => void
      stopRuleStream: (ruleName: string) => void
      stopEveryRuleStream: () => void
      startAllRulesStream: () => void
      stopAllRulesStream: () => void

      modifySettings: (newSettings: StoreSettings) => void

      openLogsFolder: () => void
      openGithub: () => void
      openReportBug: () => void
      quit: () => void

      // Render -> Main sync
      getRule: (ruleName: string) => Promise<FullRule | undefined>
      getAllRules: () => Promise<ShortRule[]>

      getSettings: () => Promise<StoreSettings | undefined>

      chooseDirectory: () => Promise<ShortPathInVolume | undefined>
    }
  }
}
