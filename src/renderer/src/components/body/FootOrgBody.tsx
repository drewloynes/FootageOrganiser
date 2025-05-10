import { ComponentProps } from 'react'
import { SidebarInset } from '../ui/sidebar'

const fileName: string = 'FootOrgBody.tsx'
const area: string = 'body'

function FootOrgBody({ children }: ComponentProps<'div'>) {
  const funcName: string = 'FootOrgBody'
  log.rend(funcName, fileName, area)

  return (
    <SidebarInset className="flex flex-col h-screen flex-1 overflow-hidden">
      {children}
    </SidebarInset>
  )
}

export default FootOrgBody
