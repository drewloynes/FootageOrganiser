type CopyFormatType = {
  newFormat: string
  setNewFormat: (value: string) => void
  addFormat: () => void
  copyFormat: never[]
}

export const CopyFormat = ({ newFormat, setNewFormat, addFormat, copyFormat }: CopyFormatType) => {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">Copy Format:</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={newFormat}
          onChange={(e) => setNewFormat(e.target.value)}
          placeholder="Enter format"
          className="flex-1 border border-gray-300 rounded p-2"
        />
        <button
          type="button"
          onClick={addFormat}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <ul className="list-disc pl-5 space-y-1">
        {copyFormat.map((format, index) => (
          <li key={index} className="text-gray-700">
            {format}
          </li>
        ))}
      </ul>
    </div>
  )
}
