import { ComponentProps } from 'react'
import { SidebarInset } from '../ui/sidebar'

const fileName = 'FootOrgBody.tsx'
const area = 'body'

function FootOrgBody({ children }: ComponentProps<'div'>): React.ReactElement {
  const funcName = 'FootOrgBody'
  log.rend(funcName, fileName, area)

  return (
    <SidebarInset className="flex flex-col h-screen flex-1 overflow-hidden">
      {children}
    </SidebarInset>
  )
}

export default FootOrgBody
