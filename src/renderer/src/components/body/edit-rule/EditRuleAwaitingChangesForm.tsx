import { motion } from 'framer-motion'

const fileName: string = 'EditRuleAwaitingChangesForm.tsx'
const area: string = 'edit-rule'

function EditRuleAwaitingChangesForm() {
  const funcName: string = 'EditRuleAwaitingChangesForm'
  log.rend(funcName, fileName, area)

  return (
    <div className="h-full items-center justify-center">
      <motion.div
        className="text-3xl font-semibold text-center "
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Can't Current Edit Rule
      </motion.div>
    </div>
  )
}

export default EditRuleAwaitingChangesForm
