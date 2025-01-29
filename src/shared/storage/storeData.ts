import * as fsProm from 'fs/promises'
import * as fs from 'fs'

const fileName: string = 'storeData.ts'
const area: string = 'FileSystem'

export async function saveData(filePath: string, data: object) {
  const funcName: string = 'saveData'
  entryLog(funcName, fileName, area)

  // Print what is being saved
  infoLog(`Saving following structure:`, funcName, fileName, area)
  console.log(data)
  // Convert to json string and save data to file
  const jsonData: string = JSON.stringify(data, null, 2) // Pretty-printed JSON
  await fsProm.writeFile(filePath, jsonData, 'utf-8')

  exitLog(funcName, fileName, area)
  return
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadData(filePath: string): Promise<any | undefined> {
  const funcName: string = 'loadData'
  entryLog(funcName, fileName, area)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any | undefined = undefined
  try {
    // Read file and parse assuming JSON
    const fileContent: string = await fsProm.readFile(filePath, 'utf-8')
    data = JSON.parse(fileContent)
    // Print what is loaded
    infoLog(`Loaded following structure`, funcName, fileName, area)
    // console.log(data)
  } catch {
    errorLog(`Unable to read ${filePath}`, funcName, fileName, area)
  }

  exitLog(funcName, fileName, area)
  return data
}

export function pathExists(path: string): boolean {
  const funcName: string = 'pathExists'
  entryLog(funcName, fileName, area)

  const exists: boolean = fs.existsSync(path)
  infoLog(`${path} exists? ${exists}`, funcName, fileName, area)

  exitLog(funcName, fileName, area)
  return exists
}
