import * as winston from 'winston'
import appConfig from '@shared/config/app'

const levels = {
  error: 0,
  warn: 1,
  http: 2,
  ipc_: 3,
  info: 4,
  debug: 5,
  cond: 6,
  func: 7
}

const colors = {
  error: 'red',
  warn: 'yellow',
  http: 'magenta',
  ipc_: 'magenta',
  info: 'green',
  debug: 'white',
  cond: 'cyan',
  func: 'grey'
}

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.align(),
  winston.format.printf((info) => `[${info.level}]: ${info.message}|${info.timestamp}|`),
  winston.format.colorize({ all: true })
)

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.ans',
    level: 'warn'
  }),
  new winston.transports.File({ filename: 'logs/server.ans' })
]

const winstonLogger = winston.createLogger({
  level: appConfig.debugConfig.logLevel,
  levels,
  format,
  transports
})

export function logger(description, funcName, fileName, area = 'unknown', severity = 'info') {
  if (shouldLog(funcName, fileName, area)) {
    winstonLogger.log(
      severity,
      description.padEnd(60, ' ') +
        '|' +
        processName.padEnd(10, ' ') +
        '|' +
        funcName.padEnd(30, ' ') +
        '|' +
        fileName.padEnd(20, ' ') +
        '|' +
        area.padEnd(10, ' ')
    )
  }
  return
}

function shouldLog(funcName, fileName, area: string): boolean {
  let shouldLog: boolean = false
  if (
    appConfig.debugConfig.logProcess.length < 1 ||
    matchStrings(processName, appConfig.debugConfig.logProcess)
  ) {
    if (
      appConfig.debugConfig.logFunc.length < 1 ||
      matchStrings(funcName, appConfig.debugConfig.logFunc)
    ) {
      if (
        appConfig.debugConfig.logFile.length < 1 ||
        matchStrings(fileName, appConfig.debugConfig.logFile)
      ) {
        if (
          appConfig.debugConfig.logArea.length < 1 ||
          matchStrings(area, appConfig.debugConfig.logArea)
        ) {
          shouldLog = true
        }
      }
    }
  }

  return shouldLog
}

function matchStrings(string: string, matchStringArray: string[]): boolean {
  // Check each file name against the files to incldue list
  const matchFound: boolean = matchStringArray.some((pattern) => {
    // Convert the wildcard pattern to a RegExp
    const regexPattern = new RegExp(
      '^' +
        pattern
          .replace(/\./g, '\\.') // Escape dots
          .replace(/\*/g, '.*') + // Replace '*' with '.*'
        '$'
    )
    return regexPattern.test(string)
  })
  return matchFound
}

export function entryLog(funcName, fileName, area = 'unknown') {
  const entryString = `Entry { ${funcName}`
  logger(entryString, funcName, fileName, area, 'func')
}

export function exitLog(funcName, fileName, area = 'unknown') {
  const entryString = `Exit } : ${funcName}`
  logger(entryString, funcName, fileName, area, 'func')
}

export function condLog(description, funcName, fileName, area = 'unknown') {
  const entryString = 'Cond: '
  logger(entryString.concat(description), funcName, fileName, area, 'cond')
}

export function ipcRecLog(description, funcName, fileName, area = 'unknown') {
  const entryString = 'IPC Received: '
  logger(entryString.concat(description), funcName, fileName, area, 'ipc_')
}

export function ipcSentLog(description, funcName, fileName, area = 'unknown') {
  const entryString = 'IPC Sent: '
  logger(entryString.concat(description), funcName, fileName, area, 'ipc_')
}

export function debugLog(description, funcName, fileName, area = 'unknown') {
  logger(description, funcName, fileName, area, 'debug')
}

export function infoLog(description, funcName, fileName, area = 'unknown') {
  logger(description, funcName, fileName, area, 'info')
}

export function warnLog(description, funcName, fileName, area = 'unknown') {
  logger(description, funcName, fileName, area, 'warn')
}

export function errorLog(description, funcName, fileName, area = 'unknown') {
  logger(description, funcName, fileName, area, 'error')
}

export default logger
