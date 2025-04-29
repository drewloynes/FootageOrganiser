import { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

const fileName: string = 'RuleButtons.tsx'
const area: string = 'sidebar'

export const RuleButtons = ({ className, ...props }: ComponentProps<'div'>) => {
  const funcName: string = 'RuleButtons'
  log.rend(funcName, fileName, area)

  return (
    <div className={twMerge('', className)} {...props}>
      <Link
        to="/"
        className="block w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-center rounded"
      >
        Rule List
      </Link>
      <Link
        to="/create-rule"
        className="block w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-center rounded"
      >
        Create New Rule
      </Link>
      <button
        className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
        onClick={() => window.electron.stopAllRules()}
      >
        Stop All Rules
      </button>
      <button
        className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
        onClick={() => window.electron.disableAllRules()}
      >
        Pause All Rules
      </button>
      <hr
        style={{
          color: 'red',
          backgroundColor: 'red',
          height: 5
        }}
      />
    </div>
  )
}
