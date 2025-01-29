const fileName: string = 'linOsUtils.ts'
const area: string = 'Linux OS'

// Linux is currently not supported!

// Tried to get vbox running on HP omen .. failed :(
// Got vbox working on old work laptop, but crashed when it tries to install npm and doesnt recognise the external hard drive :'(

// I give up on Linux implementation for now. Probably never needed anyway

export async function linGetVolNameFromFs(fs: string): Promise<string | undefined> {
  const funcName: string = 'linGetVolNameFromFs'
  entryLog(funcName, fileName, area)

  const volumeName: string | undefined = undefined

  // TBD
  errorLog('Not supported to get mount and vol names on Linux', funcName, fileName, area)

  exitLog(funcName, fileName, area)
  return volumeName
}
