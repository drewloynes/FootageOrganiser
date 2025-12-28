import { CopyPaths } from '@shared-all/types/ruleTypes'
import { pathExists } from '@shared-node/utils/filePaths'
import { sleep } from '@shared-node/utils/timer'
import * as fs from 'fs'
import path from 'path'

const fileName = 'storeLogs.ts'
const area = 'store-logs'

export enum ACTION_TYPE {
  MAKE_DIRECTORY = 'Made Directory',
  DELETE_DIRECTORY = 'Deleted Directory',
  COPY_FILE = 'Copied File',
  DELETE_FILE = 'Deleted File'
}

const month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export function addActionLog(
  ruleName: string,
  action: ACTION_TYPE,
  actionPath: string | CopyPaths
): void {
  const funcName = 'addActionLog'
  entryLog(funcName, fileName, area)

  if (glob.workerGlobals.storageLocation) {
    condLog('Storage location exists', funcName, fileName, area)

    // Create file path - logs / Day-Month-Year / ruleName.log
    const logsLocation = path.join(glob.workerGlobals.storageLocation, 'logs')
    const currentDate = new Date()
    const logDirectory = currentDate
      .getUTCDate()
      .toString()
      .concat('-', month[currentDate.getUTCMonth()], '-', currentDate.getFullYear().toString())
    const logFilePath = path.join(logsLocation, logDirectory, ruleName.concat('.log'))

    let pathsString: string
    if (action === ACTION_TYPE.COPY_FILE) {
      condLog(`Copy File Action`, funcName, fileName, area)
      const castActionPath = actionPath as CopyPaths
      pathsString = 'From: ' + castActionPath.from + ' To: ' + castActionPath.to
    } else {
      condLog(`Not Copy File Action`, funcName, fileName, area)
      pathsString = actionPath as string
    }

    fs.mkdirSync(path.dirname(logFilePath), { recursive: true })
    const line = currentDate.toUTCString() + ' | ' + action + ' | ' + pathsString + '\n'
    fs.appendFileSync(logFilePath, line, 'utf-8')
  }

  exitLog(funcName, fileName, area)
  return
}

export async function startAutoDeleteOldLogs(): Promise<void> {
  const funcName = 'startAutoDeleteOldLogs'
  entryLog(funcName, fileName, area)

  // loop infinitely, Running delete just after midnight everyday
  const continueDeleting = true
  while (continueDeleting) {
    condLog('Start log deleting loop', funcName, fileName, area)

    deleteOldLogs()

    // Wait till just after midnight
    const now = new Date()
    const tomorrowMidnight = new Date()
    tomorrowMidnight.setDate(now.getDate() + 1)
    tomorrowMidnight.setHours(0, 1, 0, 0)
    await sleep(tomorrowMidnight.getTime() - now.getTime())
  }

  exitLog(funcName, fileName, area)
  return
}

export function deleteOldLogs(): void {
  const funcName = 'deleteOldLogs'
  entryLog(funcName, fileName, area)

  const LogDirectoryMaxAge: number | undefined =
    glob.workerGlobals.currentSettings?.deleteOldLogsInDays
  if (glob.workerGlobals.storageLocation && LogDirectoryMaxAge) {
    condLog('Storage location exists', funcName, fileName, area)

    const logsLocation: string = path.join(glob.workerGlobals.storageLocation, 'logs')

    if (pathExists(logsLocation)) {
      condLog('Logs location exists', funcName, fileName, area)

      const logDirectories: string[] = fs
        .readdirSync(logsLocation)
        .filter((file) => fs.statSync(path.join(logsLocation, file)).isDirectory())
      const now = new Date()
      for (const logDirectory of logDirectories) {
        condLog(`For log directory: ${logDirectory}`, funcName, fileName, area)

        const dirDate = new Date(logDirectory)
        if (isNaN(dirDate.getTime())) {
          warnLog('Could not parse date of log directory', funcName, fileName, area)
          continue
        }

        const logDirectoryAge = (now.getTime() - dirDate.getTime()) / (1000 * 60 * 60 * 24)
        if (logDirectoryAge > LogDirectoryMaxAge) {
          condLog(`Delete log directory ${logDirectory}`, funcName, fileName, area)
          fs.rmSync(path.join(logsLocation, logDirectory), { recursive: true, force: true })
        }
      }
    }
  }

  exitLog(funcName, fileName, area)
  return
}
