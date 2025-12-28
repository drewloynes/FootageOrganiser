import * as fs from 'fs'

const fileName = 'filePaths.ts'
const area = 'utils'

export function pathExists(path: string): boolean {
  const funcName = 'pathExists'
  entryLog(funcName, fileName, area)

  const exists: boolean = fs.existsSync(path)
  infoLog(`${path} exists? ${exists}`, funcName, fileName, area)

  exitLog(funcName, fileName, area)
  return exists
}
