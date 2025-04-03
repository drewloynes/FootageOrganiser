import { Link } from 'react-router-dom'
import { ComponentProps, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export const RuleButtons = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={twMerge('', className)} {...props}>
      <Link
        to="/create-rule"
        className="block w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-center rounded"
      >
        Create New Rule
      </Link>
      <Link
        to="/"
        className="block w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-center rounded"
      >
        View Rules
      </Link>
      <button
        className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
        onClick={() => window.electron.pauseAllRules()}
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
