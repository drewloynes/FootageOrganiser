import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Name } from './Name'
import { Type } from './Type'
import { IncludesExcludesFileDir } from './IncludeExclude'
import { DirectorySelector } from './directorySelector'
import { RuleTypeSpecifics } from './RuleTypeSpecifics'

const CreateRuleForm = () => {
  const [ruleName, setRuleName] = useState('')
  const [ruleType, setRuleType] = useState('Copy File')

  const [fromFirectoryPath, setFromDirectoryPath] = useState('')
  const [toFirectoryPath, setToDirectoryPath] = useState('')

  const [newFormat, setNewFormat] = useState('')
  const [copyFormat, setCopyFormat] = useState([])
  const [autoDelete, setAutoDelete] = useState(false)
  const [customName, setCustomName] = useState('')

  const [deleteExtra, setDeleteExtra] = useState(false)

  const [cleanTarget, setCleanTarget] = useState(false)

  const [isAdditionalOpen, setIsAdditionalOpen] = useState(false)
  const [isTypeSpecificOpen, setIsTypeSpecificOpen] = useState(false)

  const addFormat = () => {
    if (newFormat.trim()) {
      setCopyFormat([...copyFormat, newFormat.trim()])
      setNewFormat('')
    }
  }

  const toggleAdditionalDropdown = () => {
    setIsAdditionalOpen(!isAdditionalOpen)
  }

  const toggleTypeSpecificDropdown = () => {
    setIsTypeSpecificOpen(!isTypeSpecificOpen)
  }

  const handlePickFromDirectory = async () => {
    if (window.electron && window.electron.openDirectory) {
      const selectedDirectory = await window.electron.openDirectory()
      if (selectedDirectory) {
        setFromDirectoryPath(selectedDirectory)
      }
    } else {
      console.error('Electron APIs are not available')
    }
  }

  const handlePickToDirectory = async () => {
    if (window.electron && window.electron.openDirectory) {
      const selectedDirectory = await window.electron.openDirectory()
      if (selectedDirectory) {
        setToDirectoryPath(selectedDirectory)
      }
    } else {
      console.error('Electron APIs are not available')
    }
  }

  return (
    <div className="flex-1 p-6 h-full overflow-y-auto bg-gray-50 pb-20">
      <h2 className="text-2xl font-bold mb-4">Create a New Rule</h2>
      <form className="space-y-6">
        {/* Rule Name */}
        <Name ruleName={ruleName} setRuleName={setRuleName} />

        {/* Rule Type */}
        <Type ruleType={ruleType} setRuleType={setRuleType} />

        {/* Origin Directory Path */}
        <DirectorySelector
          text="From Directory"
          directoryPath={fromFirectoryPath}
          setDirectoryPath={handlePickFromDirectory}
        />

        {/* Origin Directory Path */}
        <DirectorySelector
          text="To Directory"
          directoryPath={toFirectoryPath}
          setDirectoryPath={handlePickToDirectory}
        />

        {/* Additional Settings Toggle - Copy Includes and Excludes */}
        <div className="mb-4">
          <button
            type="button"
            className="text-blue-500 font-medium flex items-center"
            onClick={toggleAdditionalDropdown}
          >
            {isAdditionalOpen ? 'Hide Additional Settings' : 'Show Additional Settings'}
            <span className={`ml-2 transform ${isAdditionalOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {isAdditionalOpen && <IncludesExcludesFileDir />}
        </div>

        {/* Rule Type Specific Additional Options */}

        <div className="mb-4">
          <button
            type="button"
            className="text-blue-500 font-medium flex items-center"
            onClick={toggleTypeSpecificDropdown}
          >
            {isTypeSpecificOpen ? 'Hide Type Specific Settings' : 'Show Type Specific Settings'}
            <span className={`ml-2 transform ${isTypeSpecificOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {isTypeSpecificOpen && (
            <RuleTypeSpecifics
              ruleType={ruleType}
              newFormat={newFormat}
              setNewFormat={setNewFormat}
              addFormat={addFormat}
              copyFormat={copyFormat}
              autoDelete={autoDelete}
              setAutoDelete={setAutoDelete}
              cleanTarget={cleanTarget}
              setCleanTarget={setCleanTarget}
              customName={customName}
              setCustomName={setCustomName}
              deleteExtra={deleteExtra}
              setDeleteExtra={setDeleteExtra}
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Create Rule
        </button>
      </form>
    </div>
  )
}

export default CreateRuleForm
