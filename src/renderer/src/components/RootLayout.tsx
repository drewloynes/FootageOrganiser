import { ComponentProps, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { Link } from 'react-router-dom'

export const RootLayout = ({ children, className, ...props }: ComponentProps<'main'>) => {
  return (
    <main className={twMerge('flex h-screen', className)} {...props}>
      {children}
    </main>
  )
}
