import { twMerge } from 'tailwind-merge'
import { ComponentProps, forwardRef } from 'react'
import { RuleButtons } from './RuleButtons'
import { ExtraButtons } from './ExtraButtons'
import { AppButtons } from './AppButtons'
import { FunctonButtons } from './FunctionButtons'

export const Sidebar = ({ className, children, ...props }: ComponentProps<'aside'>) => {
  return (
    <aside
      className={twMerge('w-[250px] flex flex-col overflow-auto bg-pink-50', className)}
      {...props}
    >
      <FunctonButtons />
      <AppButtons />
      {children}
    </aside>
  )
}
