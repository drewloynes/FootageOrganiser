const fileName: string = 'timer.ts'
const area: string = 'utils'

// Sleep or pause running for a set amount of time.
export async function sleep(ms): Promise<NodeJS.Timeout> {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

// Wait till isReadyFunction reports true.
// - Returns true if function doesnt timeout
// - Returns false if function does timeout
export async function waitReady(
  isReadyFunction: () => boolean,
  timeOut: number = 10000,
  refresh: number = 200
): Promise<boolean> {
  const funcName: string = 'waitReady'
  entryLog(funcName, fileName, area)

  let timeTotal: number = 0
  let outOfTime: boolean = true
  // While we've not timed out, wait and test the isReadyFunction
  while (timeTotal < timeOut) {
    condLog('timeTotal < timeOut', funcName, fileName, area)
    if (isReadyFunction()) {
      condLog('Ready function is true', funcName, fileName, area)
      outOfTime = false
      break
    }
    timeTotal += refresh
    await sleep(refresh)
  }
  // If we timed out, log as a warning
  if (outOfTime) {
    warnLog('Ready function is true', funcName, fileName, area)
  }

  exitLog(funcName, fileName, area)
  return !outOfTime
}
