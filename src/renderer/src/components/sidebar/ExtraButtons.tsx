import { ComponentProps, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export const ExtraButtons = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={twMerge('mt-5', className)} {...props}>
      <button className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded">
        CheckSums On Mirrors
      </button>
      <button className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded">Logs</button>
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
