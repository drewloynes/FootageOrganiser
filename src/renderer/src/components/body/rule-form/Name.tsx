import { ComponentProps, useState } from 'react'
import { twMerge } from 'tailwind-merge'

type RuleNameType = {
  ruleName: string
  setRuleName: (value: string) => void
}

export const Name = ({ ruleName, setRuleName }: RuleNameType) => {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">Rule Name:</label>
      <input
        type="text"
        value={ruleName}
        onChange={(e) => setRuleName(e.target.value)}
        placeholder="Enter rule name"
        className="w-full border border-gray-300 rounded p-2"
        required
      />
    </div>
  )
}
