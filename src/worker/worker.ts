import { setupWorker } from '@worker/workerSetup'
import initWorkerGlobals from '@worker/workerInit'
import { runWorker } from './runWorker'

const fileName: string = 'worker.ts'
const funcName: string = 'Worker Entry'
const area: string = 'worker'

// Initialise Logging and global variables
initWorkerGlobals()
// Setup worker process, then run the worker
if (await setupWorker()) {
  condLog('Worker sucessfully setup', funcName, fileName, area)
  await runWorker()
} else {
  errorLog('Worker failed to setup', funcName, fileName, area)
  throw 'Worker setup failed'
}
