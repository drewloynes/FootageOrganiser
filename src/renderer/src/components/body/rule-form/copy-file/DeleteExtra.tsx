type DeleteExtraType = {
  deleteExtra: boolean
  setDeleteExtra: (value: React.SetStateAction<boolean>) => void
}

export const DeleteExtra = ({ deleteExtra, setDeleteExtra }: DeleteExtraType) => {
  return (
    <div>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={deleteExtra}
          onChange={(e) => setDeleteExtra(e.target.checked)}
          className="form-checkbox"
        />
        <span className="text-gray-700">Delete Extra</span>
      </label>
    </div>
  )
}
