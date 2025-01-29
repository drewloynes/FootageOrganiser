type RuleTypeType = {
  ruleType: string
  setRuleType: (value: string) => void
}

export const Type = ({ ruleType, setRuleType }: RuleTypeType) => {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">Rule Type:</label>
      <select
        value={ruleType}
        onChange={(e) => setRuleType(e.target.value)}
        className="w-full border border-gray-300 rounded p-2"
      >
        <option value="Copy File">Copy File</option>
        <option value="Mirror">Mirror</option>
      </select>
    </div>
  )
}
