import { ComponentProps, forwardRef } from 'react'
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
      <button className="self-end w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded">
        Settings
      </button>
      <button className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded">Help</button>
      <button className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded">About</button>
      <button className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded">Quit</button>
    </div>
  )
}
