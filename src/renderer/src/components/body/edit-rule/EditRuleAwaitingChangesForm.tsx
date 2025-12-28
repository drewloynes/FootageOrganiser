import { motion } from 'framer-motion'

const fileName = 'EditRuleAwaitingChangesForm.tsx'
const area = 'edit-rule'

function EditRuleAwaitingChangesForm(): React.ReactElement {
  const funcName = 'EditRuleAwaitingChangesForm'
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
