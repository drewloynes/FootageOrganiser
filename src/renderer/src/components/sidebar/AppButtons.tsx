import { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

const fileName: string = 'AppButtons.tsx'
const area: string = 'sidebar'

export const AppButtons = ({ className, ...props }: ComponentProps<'div'>) => {
  const funcName: string = 'AppButtons'
  log.rend(funcName, fileName, area)

  // TODO: Squash into ICONs

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
        onClick={() => window.electron.quit()}
      >
        Quit
      </button>
    </div>
  )
}
