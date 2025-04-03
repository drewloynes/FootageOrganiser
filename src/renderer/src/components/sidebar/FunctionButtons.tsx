import { ComponentProps, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { ExtraButtons } from './ExtraButtons'
import { RuleButtons } from './RuleButtons'

export const FunctonButtons = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={twMerge('mt-14 flex-1', className)} {...props}>
      <RuleButtons />
      <ExtraButtons />
    </div>
  )
}
