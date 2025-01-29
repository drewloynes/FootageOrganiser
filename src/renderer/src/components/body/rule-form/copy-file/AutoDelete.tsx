type AutoDeleteType = {
  autoDelete: boolean
  setAutoDelete: (value: React.SetStateAction<boolean>) => void
}

export const AutoDelete = ({ autoDelete, setAutoDelete }: AutoDeleteType) => {
  return (
    <div>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={autoDelete}
          onChange={(e) => setAutoDelete(e.target.checked)}
          className="form-checkbox"
        />
        <span className="text-gray-700">Auto Delete</span>
      </label>
    </div>
  )
}
