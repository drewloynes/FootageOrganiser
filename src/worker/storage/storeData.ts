import * as fsProm from 'fs/promises'

const fileName: string = 'storeData.ts'
const area: string = 'store'

export async function saveData(filePath: string, data: object) {
  const funcName: string = 'saveData'
  entryLog(funcName, fileName, area)

  const jsonData: string = JSON.stringify(data, null, 2) // Pretty JSON
  await fsProm.writeFile(filePath, jsonData, 'utf-8')
  infoLog(`Saving data`, funcName, fileName, area)

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
    const fileContent: string = await fsProm.readFile(filePath, 'utf-8')
    data = JSON.parse(fileContent) // Parse from json
    infoLog(`Loaded data`, funcName, fileName, area)
  } catch {
    errorLog(`Unable to read ${filePath}`, funcName, fileName, area)
  }

  exitLog(funcName, fileName, area)
  return data
}
