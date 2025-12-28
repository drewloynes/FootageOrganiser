interface LoggingConfiguration {
  dev: boolean
  logLevel: string
  logProcess: string[]
  logFunc: string[]
  logFile: string[]
  logArea: string[]
}

const loggerConfig: LoggingConfiguration = {
  dev: true,
  logLevel: 'func',
  logProcess: [],
  logFunc: [],
  logFile: [],
  logArea: []
}

export default loggerConfig
