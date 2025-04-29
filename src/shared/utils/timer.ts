import { PromiseResolveTimer } from './promise'

const fileName: string = 'timer.ts'
const area: string = 'utils'

export async function sleep(
  ms: number,
  id: string | undefined = undefined,
  promiseResolveTimerMap: Map<string, PromiseResolveTimer> | undefined = undefined
): Promise<boolean> {
  const funcName: string = 'sleep'
  entryLog(funcName, fileName, area)

  const promise = await new Promise((resolve) => {
    // Time out promise or let it end manually through the map
    const timer = setTimeout(() => {
      resolve(true)
    }, ms)

    if (id !== undefined && promiseResolveTimerMap !== undefined) {
      condLog(`Add ${id} to map`, funcName, fileName, area)
      promiseResolveTimerMap.set(id, { resolve, timer })
    }
  })

  exitLog(funcName, fileName, area)
  return promise as Promise<boolean> // True if slept for entire time, otherwise false
}

export function endSleep(
  id: string,
  promiseResolveTimerMap: Map<string, PromiseResolveTimer>
): boolean {
  const funcName: string = 'endSleep'
  entryLog(funcName, fileName, area)

  let sleepEnded: boolean = false
  if (promiseResolveTimerMap.has(id)) {
    condLog(`Sleep for '${id}' found in ResolveTimer map`, funcName, fileName, area)
    const resolveTimerEntry = promiseResolveTimerMap.get(id)
    resolveTimerEntry?.resolve(false) // Pop the promise
    clearTimeout(resolveTimerEntry?.timer) // End the timer
    promiseResolveTimerMap.delete(id) // Delete the map entry
    sleepEnded = true
  } else {
    warnLog(`Sleep for '${id}' not found in ResolveTimer map`, funcName, fileName, area)
  }

  exitLog(funcName, fileName, area)
  return sleepEnded
}
