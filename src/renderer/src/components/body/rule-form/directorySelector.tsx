type DirectorySelectorType = {
  directoryPath: string
  setDirectoryPath: () => Promise<void>
  text: string
}

export const DirectorySelector = ({
  directoryPath,
  setDirectoryPath,
  text
}: DirectorySelectorType) => {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">{text}</label>
      <input
        type="text"
        value={directoryPath}
        readOnly
        placeholder="Select a directory"
        className="w-full border border-gray-300 rounded p-2"
      />
      <button
        type="button"
        onClick={setDirectoryPath}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Browse
      </button>
    </div>
  )
}
