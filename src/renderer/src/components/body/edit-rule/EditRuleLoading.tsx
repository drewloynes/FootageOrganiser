import { Skeleton } from '@renderer/components/ui/skeleton'
import { motion } from 'framer-motion'

const fileName: string = 'EditRuleLoading.tsx'
const area: string = 'edit-rule'

function EditRuleLoading() {
  const funcName: string = 'EditRuleLoading'
  log.rend(funcName, fileName, area)

  return (
    <div className="items-center justify-center px-4  space-y-4 min-h-screen">
      <motion.div
        className="text-3xl font-semibold text-center"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading Rule
      </motion.div>

      {Array.from({ length: 100 }).map((_, i) => (
        <Skeleton key={i} className="h-[80px] w-full py-8 max-w-[100%] rounded-xl" />
      ))}
    </div>
  )
}

export default EditRuleLoading
