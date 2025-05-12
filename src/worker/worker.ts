// Entry File for the worker process

import { setupWorker } from '@worker/workerSetup'
import initWorkerGlobals from '@worker/workerInitialisation'
import { runWorker } from './runWorker'

const fileName: string = 'worker.ts'
const area: string = 'worker'
const funcName: string = 'Worker Entry'

initWorkerGlobals()
infoLog('Initialisation of worker globals complete', funcName, fileName, area)
await setupWorker()
infoLog('Setup of worker complete', funcName, fileName, area)
await runWorker()
