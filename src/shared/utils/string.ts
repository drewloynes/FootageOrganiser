const fileName: string = 'string.ts'
const area: string = 'utils'

export function matchStringAgainstStringArray(string: string, stringArray: string[]): boolean {
  const funcName = 'matchStringAgainstStringArray'
  entryLog(funcName, fileName, area)

  // Check each file name against the files to incldue list
  const matchFound: boolean = stringArray.some((pattern) => {
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
  debugLog(`matchFound is ${matchFound}`, funcName, fileName, area)

  exitLog(funcName, fileName, area)
  return matchFound
}
