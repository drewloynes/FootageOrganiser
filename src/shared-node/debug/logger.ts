import * as winston from 'winston'
import loggerConfig from './loggerConfig'

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

let winstonLogger: winston.Logger
if (loggerConfig.dev) {
  const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.ans',
      level: 'warn'
    }),
    new winston.transports.File({ filename: 'logs/server.ans' })
  ]

  const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.align(),
    winston.format.printf((info) => `[${info.level}]: ${info.message}|${info.timestamp}|`),
    winston.format.colorize({ all: true })
  )

  const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    http: 'magenta',
    ipc_: 'magenta',
    cond: 'cyan',
    func: 'grey'
  }

  winston.addColors(colors)

  winstonLogger = winston.createLogger({
    level: loggerConfig.logLevel,
    levels,
    format,
    transports
  })
}

/* Setup logging functions */

// Main logging function
function logger(description, funcName, fileName, area = 'unknown', severity = 'info') {
  if (shouldLog(funcName, fileName, area)) {
    winstonLogger.log(
      severity,
      description.padEnd(60, ' ') +
        '|' +
        global.processName.padEnd(10, ' ') +
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

// Decide if it should be logged based on logging filters
function shouldLog(funcName: string, fileName: string, area: string): boolean {
  let shouldLog: boolean = false

  if (!loggerConfig.dev) {
    return false
  }

  if (
    loggerConfig.logProcess.length < 1 ||
    matchStrings(global.processName, loggerConfig.logProcess)
  ) {
    if (loggerConfig.logFunc.length < 1 || matchStrings(funcName, loggerConfig.logFunc)) {
      if (loggerConfig.logFile.length < 1 || matchStrings(fileName, loggerConfig.logFile)) {
        if (loggerConfig.logArea.length < 1 || matchStrings(area, loggerConfig.logArea)) {
          shouldLog = true
        }
      }
    }
  }

  return shouldLog
}

// Match the strings - Used to match for logging filters
function matchStrings(string: string, matchStringArray: string[]): boolean {
  const matchFound: boolean = matchStringArray.some((pattern) => {
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

/* External Logging functions */

export function entryLog(funcName, fileName, area = 'unknown') {
  const entryString = `Entry { ${funcName}`
  logger(entryString, funcName, fileName, area, 'func')
}

export function exitLog(funcName, fileName, area = 'unknown') {
  const entryString = `Exit } ${funcName}`
  logger(entryString, funcName, fileName, area, 'func')
}

export function condLog(description, funcName, fileName, area = 'unknown') {
  const entryString = 'Cond: '
  logger(entryString.concat(description), funcName, fileName, area, 'cond')
}

export function condExitLog(description, funcName, fileName, area = 'unknown') {
  condLog(description, funcName, fileName, area)
  exitLog(funcName, fileName, area)
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

export function debugExitLog(description, funcName, fileName, area = 'unknown') {
  logger(description, funcName, fileName, area, 'debug')
  exitLog(funcName, fileName, area)
}

export function infoLog(description, funcName, fileName, area = 'unknown') {
  logger(description, funcName, fileName, area, 'info')
}

export function infoExitLog(description, funcName, fileName, area = 'unknown') {
  infoLog(description, funcName, fileName, area)
  exitLog(funcName, fileName, area)
}

export function warnLog(description, funcName, fileName, area = 'unknown') {
  logger(description, funcName, fileName, area, 'warn')
}

export function warnExitLog(description, funcName, fileName, area = 'unknown') {
  warnLog(description, funcName, fileName, area)
  exitLog(funcName, fileName, area)
}

export function errorLog(description, funcName, fileName, area = 'unknown') {
  logger(description, funcName, fileName, area, 'error')
}

export function errorExitLog(description, funcName, fileName, area = 'unknown') {
  errorLog(description, funcName, fileName, area)
  exitLog(funcName, fileName, area)
}

export default logger
