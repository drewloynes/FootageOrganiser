import process from 'node:process'

type LoggingConfiguration = {
  logLevel: string
  logProcess: string[]
  logFunc: string[]
  logFile: string[]
  logArea: string[]
}

const loggerConfig: LoggingConfiguration = {
  logLevel: process.env.LOG_LEVEL || 'func',
  logProcess: [],
  logFunc: [],
  logFile: [],
  logArea: []
}

export default loggerConfig
