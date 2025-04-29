import { Alert } from '@shared/types/alert'
import { ComponentProps, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import AlertBanner from './alertBanner'

const fileName: string = 'Body.tsx'
const area: string = 'body'

export const Body = ({ className, ...props }: ComponentProps<'div'>) => {
  const funcName: string = 'Body'
  log.rend(funcName, fileName, area)

  const [alert, setAlert] = useState<Alert | null>(null)

  useEffect(() => {
    console.log('Start alert')

    function handleAlert(alert: Alert) {
      console.log('Alert Received')
      console.log(alert)
      setAlert(alert)
    }

    window.electron.onAlert(handleAlert)

    return () => {
      console.log('Stop alert')
      window.electron.removeListenerAlert(handleAlert)
    }
  }, [])

  return (
    <div>
      <AlertBanner alert={alert} />
      <div className={twMerge('flex-1', className)} {...props}></div>
    </div>
  )
}
