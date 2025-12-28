import { motion } from 'framer-motion'

const fileName = 'RuleFormLoading.tsx'
const area = 'rule-form'

function RuleFormLoading(): React.ReactElement {
  const funcName = 'RuleFormLoading'
  log.rend(funcName, fileName, area)

  return (
    <div className="h-full items-center justify-center">
      <motion.div
        className="text-3xl font-semibold text-center "
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading Rule
      </motion.div>
    </div>
  )
}

export default RuleFormLoading
