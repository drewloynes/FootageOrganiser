import { CopyPaths } from '@shared/rules/rule'
import { sleep } from '@shared/utils/timer'
import * as fs from 'fs'
import path from 'path'

const fileName: string = 'storeLogs.ts'
const area: string = 'FileSystem'

export enum ActionType {
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
  action: ActionType,
  actionPaths: string | CopyPaths
) {
  const funcName: string = 'addActionLog'
  entryLog(funcName, fileName, area)

  if (storageLocation) {
    const logsLocation = path.join(storageLocation, 'logs')
    // Get file path - logs / Month-Day / ruleName.log
    const currentDate = new Date()
    const monthDayString = month[currentDate.getUTCMonth()].concat(
      '-',
      currentDate.getUTCDate().toString(),
      '-',
      currentDate.getFullYear().toString()
    )
    const logFilePath = path.join(logsLocation, monthDayString, ruleName.concat('.log'))
    const time = currentDate.toUTCString()
    let pathsString: string
    if (action === ActionType.COPY_FILE) {
      condLog(`Copy File Action`, funcName, fileName, area)
      const typedActionPaths: CopyPaths = <CopyPaths>actionPaths
      pathsString = 'From: ' + typedActionPaths.from + ' To: ' + typedActionPaths.to
    } else {
      condLog(`Not Copy File Action`, funcName, fileName, area)
      const typedActionPaths: string = <string>actionPaths
      pathsString = typedActionPaths
    }
    const line = time + ' | ' + action + ' | ' + pathsString + '\n'
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true })
    fs.appendFileSync(logFilePath, line, 'utf-8')
  }

  exitLog(funcName, fileName, area)
  return
}

export async function startAutoDeleteOldLogsOnMidnight() {
  const funcName: string = 'startAutoDeleteOldLogsOnMidnight'
  entryLog(funcName, fileName, area)

  // loop infinitely, running auto delete just after midnight everyday
  const continueDeleting = true
  while (continueDeleting) {
    condLog('Start log deleting loop', funcName, fileName, area)
    const aliveDays = footageOrganiserSettings.getAutodeleteLogsInDays()
    deleteOldLogs(aliveDays)
    // Get time to wait
    const now = new Date()
    const nextMidnightMinute = new Date(now)
    nextMidnightMinute.setHours(0, 1, 0, 0)
    if (now >= nextMidnightMinute) {
      nextMidnightMinute.setDate(nextMidnightMinute.getDate() + 1)
    }
    const timeToWait = nextMidnightMinute.getTime() - now.getTime()
    await sleep(timeToWait)
  }

  exitLog(funcName, fileName, area)
  return
}

export function deleteOldLogs(aliveDays: number) {
  const funcName: string = 'deleteOldLogs'
  entryLog(funcName, fileName, area)

  if (storageLocation) {
    condLog('Storage location exists', funcName, fileName, area)
    const logsLocation = path.join(storageLocation, 'logs')
    const dirs = fs
      .readdirSync(logsLocation)
      .filter((file) => fs.statSync(path.join(logsLocation, file)).isDirectory())
    const currentDate = new Date()
    for (const dir of dirs) {
      condLog('For dir', funcName, fileName, area)
      const dirDate = new Date(dir)
      if (isNaN(dirDate.getTime())) {
        condLog('Could not parse dir date', funcName, fileName, area)
        continue
      }
      const diffTime = currentDate.getTime() - dirDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      if (diffDays > aliveDays) {
        condLog(`Delete dir ${dir}`, funcName, fileName, area)
        const dirPath = path.join(logsLocation, dir)
        fs.rmSync(dirPath, { recursive: true, force: true })
      }
    }
  }

  exitLog(funcName, fileName, area)
  return
}
