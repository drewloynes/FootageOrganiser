import { ComponentProps } from 'react'
import { SidebarProvider } from './ui/sidebar'

const fileName: string = 'RootLayout.tsx'
const area: string = 'app'

function RootLayout({ children }: ComponentProps<'div'>) {
  const funcName: string = 'RootLayout'
  log.rend(funcName, fileName, area)

  return <SidebarProvider>{children}</SidebarProvider>
}

export default RootLayout
