type CleanTargeType = {
  cleanTarget: boolean
  setCleanTarget: (value: React.SetStateAction<boolean>) => void
}

export const CleanTarget = ({ cleanTarget, setCleanTarget }: CleanTargeType) => {
  return (
    <div>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={cleanTarget}
          onChange={(e) => setCleanTarget(e.target.checked)}
          className="form-checkbox"
        />
        <span className="text-gray-700">Auto Delete</span>
      </label>
    </div>
  )
}
