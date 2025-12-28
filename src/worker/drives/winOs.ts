import { exec } from 'child_process'
import { promisify } from 'util'

const fileName = 'winOs.ts'
const area = 'drive=info'

export async function winGetVolNameFromMount(mount: string): Promise<string | undefined> {
  const funcName = 'winGetVolNameFromMount'
  entryLog(funcName, fileName, area)

  let volumeName: string | undefined = undefined
  const execAsync = promisify(exec)
  try {
    const { stdout } = await execAsync(
      `wmic logicaldisk where "DeviceID='${mount}'" get VolumeName`
    )

    // Parse the output to extract the volume name
    const lines: string[] = stdout
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line)

    // The second line contains the volume name
    if (lines.length > 1) {
      infoLog(`Volume name ${lines[1]} found`, funcName, fileName, area)
      volumeName = lines[1]
    }
  } catch (error) {
    errorLog(`Error retrieving volume name`, funcName, fileName, area)
    throw error
  }

  exitLog(funcName, fileName, area)
  return volumeName
}
