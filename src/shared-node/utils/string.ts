const fileName: string = 'string.ts'
const area: string = 'utils'

export function matchStringAgainstStringArray(string: string, stringArray: string[]): boolean {
  const funcName = 'matchStringAgainstStringArray'
  entryLog(funcName, fileName, area)

  const matchFound: boolean = stringArray.some((pattern) => {
    condLog(`For pattern ${pattern}`, funcName, fileName, area)

    if (pattern === '*') {
      condLog(`* matches all`, funcName, fileName, area)
      return true
    }

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

  debugLog(`matchFound: ${matchFound} for ${string}`, funcName, fileName, area)

  exitLog(funcName, fileName, area)
  return matchFound
}

export function cloneStringArray(stringArray: string[]): string[] {
  const funcName = 'cloneStringArray'
  entryLog(funcName, fileName, area)

  const clonedStringArray: string[] = []
  for (const item of stringArray) {
    condLog(`Item in string arrray`, funcName, fileName, area)
    clonedStringArray.push(item)
  }

  exitLog(funcName, fileName, area)
  return clonedStringArray
}
