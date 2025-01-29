import { CleanTarget } from './CleanTarget'

type MirrorType = {
  cleanTarget: boolean
  setCleanTarget: (value: React.SetStateAction<boolean>) => void
}

export const Mirror = ({ cleanTarget, setCleanTarget }: MirrorType) => {
  return (
    <div>
      <CleanTarget cleanTarget={cleanTarget} setCleanTarget={setCleanTarget} />
    </div>
  )
}
