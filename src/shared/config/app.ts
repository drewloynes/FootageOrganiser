import process from 'node:process'

interface debugConfigLayout {
  logLevel: string
  logProcess: string[]
  logFunc: string[]
  logFile: string[]
  logArea: string[]
}

const debugConfig: debugConfigLayout = {
  logLevel: process.env.LOG_LEVEL || 'func',
  logProcess: [],
  logFunc: [],
  logFile: [],
  logArea: []
}

const appConfig = {
  debugConfig: debugConfig
}

export default appConfig
