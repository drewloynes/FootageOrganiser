import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const Body = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div className={twMerge('flex-1', className)} {...props}></div>
}
