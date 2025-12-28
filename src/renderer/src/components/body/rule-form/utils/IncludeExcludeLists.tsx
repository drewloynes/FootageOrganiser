import { StoreRule } from '@shared-all/types/ruleTypes'
import { motion } from 'framer-motion'
import { Control, FieldPath } from 'react-hook-form'
import { DynamicList } from './DynamicList'

const fileName = 'IncludeExcludeLists.tsx'
const area = 'rule-form'

export function IncludeExcludeLists({
  control,
  listParentName
}: {
  control: Control<StoreRule>
  listParentName: string
}): React.ReactElement {
  const funcName = 'IncludeExcludeLists'
  log.rend(funcName, fileName, area)

  const includeFileFullName: FieldPath<StoreRule> = listParentName.concat(
    '.filesToInclude'
  ) as FieldPath<StoreRule>
  const ExcludeFileFullName: FieldPath<StoreRule> = listParentName.concat(
    '.filesToExclude'
  ) as FieldPath<StoreRule>
  const includeDirFullName: FieldPath<StoreRule> = listParentName.concat(
    '.dirsToInclude'
  ) as FieldPath<StoreRule>
  const excludeDirFullName: FieldPath<StoreRule> = listParentName.concat(
    '.dirsToExclude'
  ) as FieldPath<StoreRule>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <DynamicList control={control} name={includeFileFullName} label="Files To Include" />
      <DynamicList control={control} name={ExcludeFileFullName} label="Files To Exclude" />
      <DynamicList control={control} name={includeDirFullName} label="Folders To Include" />
      <DynamicList control={control} name={excludeDirFullName} label="Folders To Exclude" />
    </motion.div>
  )
}
