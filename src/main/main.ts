import 'source-map-support/register'
import initMainGlobals from './mainInitialisation'
import { setupMain } from './mainSetup'

const fileName: string = 'main.ts'
const area: string = 'main'
const funcName: string = 'Main Entry'

initMainGlobals()
infoLog('Initialisation of main globals complete', funcName, fileName, area)
setupMain()
infoLog('Setup of main complete', funcName, fileName, area)
