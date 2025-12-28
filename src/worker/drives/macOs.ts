import { exec } from 'child_process'
import { promisify } from 'util'

const fileName = 'macOs.ts'
const area = 'drive-info'

export async function macGetAllDriveInfoFromFs(fs: string): Promise<(string | undefined)[]> {
  const funcName = 'macGetVolNameFromFs'
  entryLog(funcName, fileName, area)

  let volumeName: string | undefined = undefined
  let driveFormat: string | undefined = undefined

  const execAsync = promisify(exec)
  try {
    const { stdout } = await execAsync(`diskutil info ${fs}`)

    // Parse exec output imto string array
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

    // If volume name has length, then we've found it
    if (parsedInfo['Volume Name'].trim().length > 0) {
      infoLog(`Volume name ${parsedInfo['Volume Name'].trim()} found`, funcName, fileName, area)
      volumeName = parsedInfo['Volume Name'].trim()
    }

    // If File System Personality has length, we've found the drive format
    if (parsedInfo['File System Personality'].trim().length > 0) {
      infoLog(
        `File System Personality ${parsedInfo['File System Personality'].trim()} found`,
        funcName,
        fileName,
        area
      )
      driveFormat = parsedInfo['File System Personality'].trim()
    }
  } catch (error) {
    errorLog(`Error retrieving volume name`, funcName, fileName, area)
    throw error
  }

  exitLog(funcName, fileName, area)
  return [volumeName, driveFormat]
}
