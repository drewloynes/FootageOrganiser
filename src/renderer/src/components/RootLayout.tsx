import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

const fileName: string = 'RootLayout.tsx'
const area: string = 'app'

export const RootLayout = ({ children, className, ...props }: ComponentProps<'main'>) => {
  const funcName: string = 'RootLayout'
  log.rend(funcName, fileName, area)

  return (
    <main className={twMerge('flex h-screen', className)} {...props}>
      {children}
    </main>
  )
}
