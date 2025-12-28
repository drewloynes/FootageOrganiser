import { Alert } from '@shared-all/types/alert'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'

const fileName = 'AlertPopUp.tsx'
const area = 'alert'

function AlertPopUp(): React.ReactElement {
  const funcName = 'AlertPopUp'
  log.rend(funcName, fileName, area)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [alert, setAlert] = useState<Alert | null>(null)

  useEffect(() => {
    log.cond('useEffect: Setup receiving alert IPC', funcName, fileName, area)

    function handleAlert(alert: Alert): void {
      log.ipcRec('Alert', funcName, fileName, area, alert)
      setAlert(alert)
      setIsDialogOpen(true)
    }

    log.ipcSent(`Setup Alert Handle`, funcName, fileName, area)
    window.electron.onAlert(handleAlert)

    return () => {
      log.ipcSent(`Destroy Alert Handle`, funcName, fileName, area)
      window.electron.removeListenerAlert(handleAlert)
    }
  }, [])

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="break-all">
        <DialogHeader>
          <DialogTitle>{alert?.title}</DialogTitle>
          <DialogDescription>{alert?.message}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AlertPopUp
