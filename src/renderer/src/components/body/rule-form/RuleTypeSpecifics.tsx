import { CopyFile } from './copy-file/CopyFile'
import { Mirror } from './mirror/mirror'

type RuleTypeSpecificsType = {
  ruleType: string
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
  cleanTarget: boolean
  setCleanTarget: (value: React.SetStateAction<boolean>) => void
}

export const RuleTypeSpecifics = ({
  ruleType,
  newFormat,
  setNewFormat,
  addFormat,
  copyFormat,
  autoDelete,
  setAutoDelete,
  customName,
  setCustomName,
  cleanTarget,
  setCleanTarget,
  deleteExtra,
  setDeleteExtra
}: RuleTypeSpecificsType) => {
  return (
    <div>
      {ruleType === 'Copy File' && (
        <>
          <CopyFile
            newFormat={newFormat}
            setNewFormat={setNewFormat}
            addFormat={addFormat}
            copyFormat={copyFormat}
            autoDelete={autoDelete}
            setAutoDelete={setAutoDelete}
            customName={customName}
            setCustomName={setCustomName}
            deleteExtra={deleteExtra}
            setDeleteExtra={setDeleteExtra}
          />
        </>
      )}
      {ruleType === 'Mirror' && (
        <>
          <Mirror cleanTarget={cleanTarget} setCleanTarget={setCleanTarget} />
        </>
      )}
    </div>
  )
}
