import CLIENT_LOG_CONFIG from './clientLoggerConfig'

export enum CLIENT_LOG_LEVEL {
  ERROR = 'Error',
  WARN = 'Warn',
  INFO = 'Info',
  DEBUG = 'Debug',
  IPC_SENT = 'IPC Sent',
  IPC_REC = 'IPC Rec',
  COND = 'Cond',
  REND = 'Rend',
  ENTRY = 'Entry',
  EXIT = 'Exit'
}

export function initialiseLogger(): void {
  ;(globalThis as any).log = new ClientLogger()
}

export class ClientLogger {
  private generateLogIntro(level: CLIENT_LOG_LEVEL): string {
    return `%c[${level.toUpperCase()}] ${new Date().toISOString()}`.padEnd(20, ' ')
  }

  private generateLogMessage(func: string, file: string, area: string, desc?: string): string {
    let generateMessage: string = ''
    if (desc) {
      generateMessage = desc.padEnd(30, ' ') + '|'
    }
    generateMessage =
      generateMessage +
      func.padEnd(30, ' ') +
      '|' +
      file.padEnd(20, ' ') +
      '|' +
      area.padEnd(10, ' ')
    return generateMessage
  }

  private matchStrings(string: string, matchStringArray: string[]): boolean {
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

  private shouldLog(level: CLIENT_LOG_LEVEL, func: string, file: string, area: string): boolean {
    let shouldLog: boolean = false

    if (CLIENT_LOG_CONFIG.level.length < 1 || this.matchStrings(level, CLIENT_LOG_CONFIG.level)) {
      if (CLIENT_LOG_CONFIG.func.length < 1 || this.matchStrings(func, CLIENT_LOG_CONFIG.func)) {
        if (CLIENT_LOG_CONFIG.file.length < 1 || this.matchStrings(file, CLIENT_LOG_CONFIG.file)) {
          if (
            CLIENT_LOG_CONFIG.area.length < 1 ||
            this.matchStrings(area, CLIENT_LOG_CONFIG.area)
          ) {
            shouldLog = true
          }
        }
      }
    }
    return shouldLog
  }

  error(desc: string, func: string, file: string, area: string) {
    if (this.shouldLog(CLIENT_LOG_LEVEL.ERROR, func, file, area)) {
      console.error(
        this.generateLogIntro(CLIENT_LOG_LEVEL.ERROR),
        'color: red; font-weight: bold;',
        this.generateLogMessage(desc, func, file, area)
      )
    }
  }

  warn(desc: string, func: string, file: string, area: string) {
    if (this.shouldLog(CLIENT_LOG_LEVEL.WARN, func, file, area)) {
      console.warn(
        this.generateLogIntro(CLIENT_LOG_LEVEL.WARN),
        'color: yellow; font-weight: bold;',
        this.generateLogMessage(desc, func, file, area)
      )
    }
  }

  info(desc: string, func: string, file: string, area: string) {
    if (this.shouldLog(CLIENT_LOG_LEVEL.INFO, func, file, area)) {
      console.info(
        this.generateLogIntro(CLIENT_LOG_LEVEL.INFO),
        'color: green; font-weight: bold;',
        this.generateLogMessage(desc, func, file, area)
      )
    }
  }

  debug(desc: string, func: string, file: string, area: string, data?: any) {
    if (this.shouldLog(CLIENT_LOG_LEVEL.DEBUG, func, file, area)) {
      console.log(
        this.generateLogIntro(CLIENT_LOG_LEVEL.DEBUG),
        'color: blue;',
        this.generateLogMessage(desc, func, file, area)
      )
      if (data) {
        console.log(data)
      }
    }
  }

  ipcSent(desc: string, func: string, file: string, area: string, data?: any) {
    if (this.shouldLog(CLIENT_LOG_LEVEL.IPC_SENT, func, file, area)) {
      console.log(
        this.generateLogIntro(CLIENT_LOG_LEVEL.IPC_SENT),
        'color: magenta;',
        this.generateLogMessage(desc, func, file, area)
      )
      if (data) {
        console.log(data)
      }
    }
  }

  ipcRec(desc: string, func: string, file: string, area: string, data?: any) {
    if (this.shouldLog(CLIENT_LOG_LEVEL.IPC_REC, func, file, area)) {
      console.log(
        this.generateLogIntro(CLIENT_LOG_LEVEL.IPC_REC),
        'color: magenta;',
        this.generateLogMessage(desc, func, file, area)
      )
      if (data) {
        console.log(data)
      }
    }
  }

  cond(desc: string, func: string, file: string, area: string) {
    if (this.shouldLog(CLIENT_LOG_LEVEL.COND, func, file, area)) {
      console.log(
        this.generateLogIntro(CLIENT_LOG_LEVEL.COND),
        'color: cyan;',
        this.generateLogMessage(desc, func, file, area)
      )
    }
  }

  rend(func: string, file: string, area: string) {
    if (this.shouldLog(CLIENT_LOG_LEVEL.REND, func, file, area)) {
      console.log(
        this.generateLogIntro(CLIENT_LOG_LEVEL.REND),
        'color: beige;',
        this.generateLogMessage(func, file, area)
      )
    }
  }

  entry(func: string, file: string, area: string) {
    if (this.shouldLog(CLIENT_LOG_LEVEL.ENTRY, func, file, area)) {
      console.log(
        this.generateLogIntro(CLIENT_LOG_LEVEL.ENTRY),
        'color: grey;',
        this.generateLogMessage(func, file, area)
      )
    }
  }

  exit(func: string, file: string, area: string) {
    if (this.shouldLog(CLIENT_LOG_LEVEL.EXIT, func, file, area)) {
      console.log(
        this.generateLogIntro(CLIENT_LOG_LEVEL.EXIT),
        'color: grey;',
        this.generateLogMessage(func, file, area)
      )
    }
  }
}
