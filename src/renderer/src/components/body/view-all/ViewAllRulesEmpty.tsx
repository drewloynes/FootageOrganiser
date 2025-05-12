import { Button } from '@renderer/components/ui/button'
import { motion } from 'framer-motion'
import { AlertCircle, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

const fileName: string = 'ViewAllRulesEmpty.tsx'
const area: string = 'view-all'

function ViewAllRulesEmpty() {
  const funcName: string = 'ViewAllRulesEmpty'
  log.rend(funcName, fileName, area)

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center  bg-muted p-4 rounded-full shadow"
      >
        <AlertCircle className="h-10 w-10 " />
      </motion.div>

      <motion.h1
        className="text-2xl font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        No Rules Found
      </motion.h1>

      <motion.p
        className="text-muted-foreground max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        It looks like you haven't created any rules yet.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link to="/create-rule">
          <Button>
            <Plus />
            Create A New Rule
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}

export default ViewAllRulesEmpty
