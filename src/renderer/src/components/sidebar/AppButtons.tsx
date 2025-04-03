import { ComponentProps, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

export const AppButtons = ({ className, ...props }: ComponentProps<'div'>) => {
  const style3 = {
    parent: {
      position: 'relative'
    },
    bottom: {
      position: 'absolute',
      bottom: '0px'
    }
  }
  return (
    <div className={twMerge('mt-5 flex-end', className)} {...props}>
      <Link
        to="/settings"
        className="block w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-center rounded"
      >
        Settings
      </Link>
      <Link
        to="/help"
        className="block w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-center rounded"
      >
        Help
      </Link>
      <Link
        to="/about"
        className="block w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-center rounded"
      >
        About
      </Link>
      <button
        className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
        onClick={() => window.electron.quitFootageOrganiser()}
      >
        Quit
      </button>
    </div>
  )
}
