import { exec } from 'child_process'
import { promisify } from 'util'

const fileName: string = 'macOsUtils.ts'
const area: string = 'Mac OS'

export async function macGetVolNameFromFs(fs: string): Promise<string | undefined> {
  const funcName: string = 'macGetVolNameFromFs'
  entryLog(funcName, fileName, area)

  const execAsync = promisify(exec)
  let volumeName: string | undefined = undefined
  try {
    const { stdout } = await execAsync(`diskutil info ${fs}`)

    const parsedInfo: Record<string, string> = {}
    const stdoutLines: string[] = stdout.split('\n')
    stdoutLines.forEach((line) => {
      const match = line.match(/^(\s*\S.*?):\s*(.*)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim()
        parsedInfo[key] = value
      }
    })
    // If volume name has length, then set it
    if (parsedInfo['Volume Name'].trim().length > 0) {
      infoLog(`Volume name ${parsedInfo['Volume Name'].trim()} found`, funcName, fileName, area)
      volumeName = parsedInfo['Volume Name'].trim()
    } else {
      errorLog('Volume name not found', funcName, fileName, area)
    }
  } catch (error) {
    errorLog(`Error reteieving mounted drives - ${error}`, funcName, fileName, area)
    throw error
  }

  exitLog(funcName, fileName, area)
  return volumeName
}
