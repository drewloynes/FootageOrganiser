import { AutoDelete } from './AutoDelete'
import { CopyFormat } from './CopyFormat'
import { CustomName } from './CustomName'
import { DeleteExtra } from './DeleteExtra'

type CopyFileType = {
  newFormat: string
  setNewFormat: (value: string) => void
  addFormat: () => void
  copyFormat: never[]
  autoDelete: boolean
  setAutoDelete: (value: React.SetStateAction<boolean>) => void
  customName: string
  setCustomName: (value: string) => void
  deleteExtra: boolean
  setDeleteExtra: (value: React.SetStateAction<boolean>) => void
}

export const CopyFile = ({
  newFormat,
  setNewFormat,
  addFormat,
  copyFormat,
  autoDelete,
  setAutoDelete,
  customName,
  setCustomName,
  deleteExtra,
  setDeleteExtra
}: CopyFileType) => {
  return (
    <div>
      <AutoDelete autoDelete={autoDelete} setAutoDelete={setAutoDelete} />
      <CopyFormat
        newFormat={newFormat}
        setNewFormat={setNewFormat}
        addFormat={addFormat}
        copyFormat={copyFormat}
      />
      <CustomName customName={customName} setCustomName={setCustomName} />
      <DeleteExtra deleteExtra={deleteExtra} setDeleteExtra={setDeleteExtra} />
    </div>
  )
}
