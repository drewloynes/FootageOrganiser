import { app, utilityProcess, MessageChannelMain } from 'electron'
// import { resolve } from 'path'
import forkPath from '@worker/worker?modulePath'
import { IpcMessage } from '@shared/utils/ipc'

const fileName: string = 'fork.ts'
const area: string = 'fork'

export default function createWorkerProcess(): void {
  const funcName: string = 'createWorkerProcess'
  entryLog(funcName, fileName, area)

  // Create worker process
  const workerPrcoess = utilityProcess.fork(forkPath)
  // Create ports for communication and send to worker proc
  const { port1, port2 } = new MessageChannelMain()
  const message = new IpcMessage('alive', {})
  workerPrcoess.postMessage({ message: message }, [port1])
  // Needs an extra message through port 2 for shit to work
  const extraMessage = new IpcMessage('alive', {})
  port2.start()
  port2.postMessage(extraMessage)
  //
  port2.on('message', (e) => {
    infoLog('Port 2 receieved', funcName, fileName, area)
    switch (e.data.id) {
      case 'storage-location': {
        infoLog('storage location parsed', funcName, fileName, area)
        const message = new IpcMessage('storage-location', app.getPath('userData'))
        port2.start()
        port2.postMessage(message)
        break
      }
    }
  })

  exitLog(funcName, fileName, area)
  return
}
