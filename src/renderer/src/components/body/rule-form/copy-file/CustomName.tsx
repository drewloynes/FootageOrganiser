type CustomNameType = {
  customName: string
  setCustomName: (value: string) => void
}

export const CustomName = ({ customName, setCustomName }: CustomNameType) => {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">Custom Name:</label>
      <input
        type="text"
        value={customName}
        onChange={(e) => setCustomName(e.target.value)}
        placeholder="Enter custom name"
        className="w-full border border-gray-300 rounded p-2"
        required
      />
    </div>
  )
}
