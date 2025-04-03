import create from 'zustand'

export const useRuleStore = create((set) => ({
  ruleType: 'Copy File', // Default rule type
  setRuleType: (type) => set({ ruleType: type })
}))
