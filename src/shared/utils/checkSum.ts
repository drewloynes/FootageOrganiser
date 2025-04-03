import * as fs from 'fs'
import * as crypto from 'crypto'
import * as crc32 from 'crc-32'

const fileName: string = 'checkSum.ts'
const area: string = 'utils'

export enum CheckSumType {
  CRC = 'crc',
  MD5 = 'md5',
  SHA_256 = 'sha-256'
}

export async function generateCheckSum(
  pathToFile: string,
  checkSumType: CheckSumType
): Promise<string> {
  const funcName: string = 'shouldFileBeDeleted'
  entryLog(funcName, fileName, area)

  let checkSum: string = ''
  switch (checkSumType) {
    case CheckSumType.CRC: {
      checkSum = await generateCrcCheckSum(pathToFile)
      break
    }
    case CheckSumType.MD5: {
      checkSum = await generateMd5CheckSum(pathToFile)
      break
    }
    case CheckSumType.SHA_256: {
      checkSum = await generateSha256CheckSum(pathToFile)
      break
    }
  }
  infoLog(`Generated checksum: ${checkSum}`, funcName, fileName, area)

  exitLog(funcName, fileName, area)
  return checkSum
}

function generateCrcCheckSum(pathToFile) {
  const funcName: string = 'generateCrcCheckSum'
  entryLog(funcName, fileName, area)

  const checkSum: Promise<string> = new Promise((resolve, reject) => {
    condLog(`Auto clean from path: TRUE`, funcName, fileName, area)
    let hash = crc32.buf([])
    const stream = fs.createReadStream(pathToFile, { encoding: undefined })

    stream.on('data', (chunk) => {
      // Update the CRC32 checksum with each chunk
      if (Buffer.isBuffer(chunk)) {
        // Update the CRC32 checksum with the chunk as a Uint8Array
        hash = crc32.buf(chunk, hash)
      } else {
        // Handle cases where chunk might be a string (not expected in binary mode)
        reject(new Error('Unexpected string chunk received'))
      }
    })

    stream.on('end', () => {
      // Convert the CRC32 checksum to an 8-character hexadecimal string
      resolve((hash >>> 0).toString(16).padStart(8, '0'))
    })

    stream.on('error', (err) => reject(err))
  })

  exitLog(funcName, fileName, area)
  return checkSum
}

function generateMd5CheckSum(pathToFile) {
  const funcName: string = 'generateMd5CheckSum'
  entryLog(funcName, fileName, area)

  const checkSum: Promise<string> = new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5')
    const stream = fs.createReadStream(pathToFile)

    stream.on('data', (data) => hash.update(data))
    stream.on('end', () => resolve(hash.digest('hex')))
    stream.on('error', (err) => reject(err))
  })

  exitLog(funcName, fileName, area)
  return checkSum
}

function generateSha256CheckSum(pathToFile): Promise<string> {
  const funcName: string = 'generateSha256CheckSum'
  entryLog(funcName, fileName, area)

  const checkSum: Promise<string> = new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    const stream = fs.createReadStream(pathToFile)

    stream.on('data', (data) => hash.update(data))
    stream.on('end', () => resolve(hash.digest('hex')))
    stream.on('error', (err) => reject(err))
  })

  exitLog(funcName, fileName, area)
  return checkSum
}
