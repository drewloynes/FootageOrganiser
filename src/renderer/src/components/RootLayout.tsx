import { ComponentProps } from 'react'
import { SidebarProvider } from './ui/sidebar'

const fileName = 'RootLayout.tsx'
const area = 'app'

function RootLayout({ children }: ComponentProps<'div'>): React.ReactElement {
  const funcName = 'RootLayout'
  log.rend(funcName, fileName, area)

  return <SidebarProvider>{children}</SidebarProvider>
}

export default RootLayout
