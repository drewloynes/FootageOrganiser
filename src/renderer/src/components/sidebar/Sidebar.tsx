import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { AppButtons } from './AppButtons'
import { FunctonButtons } from './FunctionButtons'

const fileName: string = 'Sidebar.tsx'
const area: string = 'sidebar'

export const Sidebar = ({ className, children, ...props }: ComponentProps<'aside'>) => {
  const funcName: string = 'Sidebar'
  log.rend(funcName, fileName, area)

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
