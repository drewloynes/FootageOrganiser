import { ComponentProps, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export const IncludesExcludesFileDir = ({ className, ...props }: ComponentProps<'div'>) => {
  const [fileExcludes, setFileExcludes] = useState([])
  const [fileIncludes, setFileIncludes] = useState([])
  const [newFileInclude, setNewFileInclude] = useState('')
  const [newFileExclude, setNewFileExclude] = useState('')

  const [dirExcludes, setDirExcludes] = useState([])
  const [dirIncludes, setDirIncludes] = useState([])
  const [newDirInclude, setNewDirInclude] = useState('')
  const [newDirExclude, setNewDirExclude] = useState('')

  // Add to include file list
  const addFileInclude = () => {
    if (newFileInclude.trim()) {
      setFileIncludes([...fileIncludes, newFileInclude.trim()])
      setNewFileInclude('')
    }
  }

  // Add to exclude file list
  const addFileExclude = () => {
    if (newFileExclude.trim()) {
      setFileExcludes([...fileExcludes, newFileExclude.trim()])
      setNewFileExclude('')
    }
  }

  // Remove from include file list
  const removeFileInclude = (index) => {
    const updatedIncludes = fileIncludes.filter((_, i) => i !== index)
    setFileIncludes(updatedIncludes)
  }

  // Remove from exclude file list
  const removeFileExclude = (index) => {
    const updatedExcludes = fileExcludes.filter((_, i) => i !== index)
    setFileExcludes(updatedExcludes)
  }

  // Add to include file list
  const addDirInclude = () => {
    if (newDirInclude.trim()) {
      setDirIncludes([...dirIncludes, newDirInclude.trim()])
      setNewDirInclude('')
    }
  }

  // Add to exclude file list
  const addDirExclude = () => {
    if (newDirExclude.trim()) {
      setDirExcludes([...dirExcludes, newDirExclude.trim()])
      setNewDirExclude('')
    }
  }

  // Remove from include file list
  const removeDirInclude = (index) => {
    const updatedIncludes = dirIncludes.filter((_, i) => i !== index)
    setDirIncludes(updatedIncludes)
  }

  // Remove from exclude file list
  const removeDirExclude = (index) => {
    const updatedExcludes = dirExcludes.filter((_, i) => i !== index)
    setDirExcludes(updatedExcludes)
  }

  return (
    <div className={twMerge('', className)} {...props}>
      <div>
        <label className="block text-gray-700 font-medium mb-2">Include File List:</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newFileInclude}
            onChange={(e) => setNewFileInclude(e.target.value)}
            placeholder="Add to include list"
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <button
            type="button"
            onClick={addFileInclude}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <ul className="list-disc pl-5 space-y-1">
          {fileIncludes.map((include, index) => (
            <li key={index} className="flex items-center justify-between">
              <span className="text-gray-700">{include}</span>
              <button
                type="button"
                onClick={() => removeFileInclude(index)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">Exclude File List:</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newFileExclude}
            onChange={(e) => setNewFileExclude(e.target.value)}
            placeholder="Add to exclude list"
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <button
            type="button"
            onClick={addFileExclude}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <ul className="list-disc pl-5 space-y-1">
          {fileExcludes.map((exclude, index) => (
            <li key={index} className="flex items-center justify-between">
              <span className="text-gray-700">{exclude}</span>
              <button
                type="button"
                onClick={() => removeFileExclude(index)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">Include Folder List:</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newDirInclude}
            onChange={(e) => setNewDirInclude(e.target.value)}
            placeholder="Add to include list"
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <button
            type="button"
            onClick={addDirInclude}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <ul className="list-disc pl-5 space-y-1">
          {dirIncludes.map((include, index) => (
            <li key={index} className="flex items-center justify-between">
              <span className="text-gray-700">{include}</span>
              <button
                type="button"
                onClick={() => removeDirInclude(index)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">Exclude Folder List:</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newDirExclude}
            onChange={(e) => setNewDirExclude(e.target.value)}
            placeholder="Add to exclude folder list"
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <button
            type="button"
            onClick={addDirExclude}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <ul className="list-disc pl-5 space-y-1">
          {dirExcludes.map((exclude, index) => (
            <li key={index} className="flex items-center justify-between">
              <span className="text-gray-700">{exclude}</span>
              <button
                type="button"
                onClick={() => removeDirExclude(index)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
