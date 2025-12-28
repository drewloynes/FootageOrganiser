const fileName = 'streamUpdates.ts'
const area = 'utils'

export class StreamUpdate {
  // ID for the setInterval
  intervalId: NodeJS.Timeout | undefined
  // Time to wait in-between sending messages
  timeBetweenMessages: number // In milliseconds
  // Whether there are new updates to stream since the last message
  updatesToStream: boolean
  // Message sending function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messageSendingFunciton: (data: any) => void
  // Data to send on stream
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messageData: any

  constructor(
    timeBetweenMessages: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messageSendingFunciton: (data: any) => void
  ) {
    this.intervalId = undefined
    this.timeBetweenMessages = timeBetweenMessages
    this.updatesToStream = false
    this.messageSendingFunciton = messageSendingFunciton
    this.messageData = undefined
    this.attemptSend = this.attemptSend.bind(this)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  start(initialMessageData: any): void {
    const funcName = 'start'
    entryLog(funcName, fileName, area)

    if (this.intervalId) {
      condExitLog('intervalId already exists', funcName, fileName, area)
      return
    }

    this.messageData = initialMessageData
    this.updatesToStream = true

    this.intervalId = setInterval(this.attemptSend, this.timeBetweenMessages)

    exitLog(funcName, fileName, area)
    return
  }

  private async attemptSend(): Promise<void> {
    const funcName = 'attemptSend'
    entryLog(funcName, fileName, area)

    try {
      if (this.updatesToStream) {
        condLog('There are updates to send', funcName, fileName, area)
        this.messageSendingFunciton(this.messageData)
        this.updatesToStream = false
      }
    } catch {
      errorLog('messageSendingFunction failed', funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return
  }

  stop(): void {
    const funcName = 'stop'
    entryLog(funcName, fileName, area)

    this.messageData = undefined
    this.updatesToStream = false

    if (this.intervalId) {
      condLog(`intervalId exists`, funcName, fileName, area)
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }

    exitLog(funcName, fileName, area)
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateData(messageData: any): void {
    const funcName = 'updateData'
    entryLog(funcName, fileName, area)

    if (this.intervalId) {
      condLog('intervalId exists', funcName, fileName, area)
      this.messageData = messageData
      this.updatesToStream = true
    }

    exitLog(funcName, fileName, area)
    return
  }
}
