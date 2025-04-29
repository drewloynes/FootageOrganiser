import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { ExtraButtons } from './ExtraButtons'
import { RuleButtons } from './RuleButtons'

const fileName: string = 'FunctonButtons.tsx'
const area: string = 'sidebar'

export const FunctonButtons = ({ className, ...props }: ComponentProps<'div'>) => {
  const funcName: string = 'FunctonButtons'
  log.rend(funcName, fileName, area)

  return (
    <div className={twMerge('mt-14 flex-1', className)} {...props}>
      <RuleButtons />
      <ExtraButtons />
    </div>
  )
}
