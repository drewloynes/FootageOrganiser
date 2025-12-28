// Entry File for the worker process
import initWorkerGlobals from '@worker/workerInitialisation'
import { setupWorker } from '@worker/workerSetup'
import * as fs from 'fs'
import path from 'path'
import 'source-map-support/register'
import { runWorker } from './runWorker'

const fileName = 'worker.ts'
const area = 'worker'
const funcName = 'Worker Entry'

try {
  initWorkerGlobals()
  infoLog('Initialisation of worker globals complete', funcName, fileName, area)
  await setupWorker()
  infoLog('Setup of worker complete', funcName, fileName, area)
  await runWorker()
} catch (error) {
  // Attempt to write error before crashing
  if (glob.workerGlobals.storageLocation && error instanceof Error) {
    const logFilePath = path.join(glob.workerGlobals.storageLocation, 'error.log')
    const stackTrace = error.stack ?? ''
    const cause = error.cause ?? ''
    fs.writeFileSync(
      logFilePath,
      error.name + ` | ` + error.message + ` | ` + stackTrace + ` | ` + cause,
      'utf-8'
    )
  }
}
