import { motion } from 'framer-motion'

const fileName: string = 'RuleFormLoading.tsx'
const area: string = 'rule-form'

function RuleFormLoading() {
  const funcName: string = 'RuleFormLoading'
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
