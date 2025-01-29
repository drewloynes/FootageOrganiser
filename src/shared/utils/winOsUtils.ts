import { exec } from 'child_process'
import { promisify } from 'util'

const fileName: string = 'winOsUtils.ts'
const area: string = 'Windows OS'

export async function winGetVolNameFromMount(mount: string): Promise<string | undefined> {
  const funcName: string = 'winGetVolNameFromMount'
  entryLog(funcName, fileName, area)

  const execAsync = promisify(exec)
  let volumeName: string | undefined = undefined
  try {
    const { stdout } = await execAsync(
      `wmic logicaldisk where "DeviceID='${mount}'" get VolumeName`
    )
    // Parse the output to extract the volume name
    const lines: string[] = stdout
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line)
    if (lines.length > 1) {
      infoLog(`Volume name ${lines[1]} found`, funcName, fileName, area)
      // The second line typically contains the volume name
      volumeName = lines[1]
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
