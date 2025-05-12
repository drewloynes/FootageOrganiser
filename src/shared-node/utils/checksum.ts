import { CHECKSUM_TYPE } from '@shared-all/types/checksumTypes'
import { CRC32Stream } from 'crc32-stream'
import * as crypto from 'crypto'
import * as fs from 'fs'

const fileName: string = 'checksum.ts'
const area: string = 'utils'

export async function generateChecksum(
  pathToFile: string,
  checksumType: CHECKSUM_TYPE
): Promise<string> {
  const funcName: string = 'generateChecksum'
  entryLog(funcName, fileName, area)

  let checksum: string = ''
  switch (checksumType) {
    case CHECKSUM_TYPE.CRC: {
      condLog('CRC checksum', funcName, fileName, area)
      checksum = await generateCrcChecksum(pathToFile)
      break
    }
    case CHECKSUM_TYPE.MD5: {
      condLog('MD5 checksum', funcName, fileName, area)
      checksum = await generateMd5Checksum(pathToFile)
      break
    }
    case CHECKSUM_TYPE.SHA_256: {
      condLog('SHA 256 checksum', funcName, fileName, area)
      checksum = await generateSha256Checksum(pathToFile)
      break
    }
  }
  debugLog(`Generated checksum: ${checksum}`, funcName, fileName, area)

  exitLog(funcName, fileName, area)
  return checksum
}

function generateCrcChecksum(pathToFile: string): Promise<string> {
  const funcName: string = 'generateCrcChecksum'
  entryLog(funcName, fileName, area)

  const checkSum: Promise<string> = new Promise((resolve, reject) => {
    condLog('Start CRC checksum promise', funcName, fileName, area)

    const stream = fs.createReadStream(pathToFile)
    const crcStream = new CRC32Stream()

    crcStream.on('data', (chunk) =>
      condLog(`CRC chunk: ${chunk.length} bytes`, funcName, fileName, area)
    )

    stream.on('error', (err) => {
      condLog('Read stream error encountered', funcName, fileName, area)
      reject(err)
    })

    crcStream.on('error', (err) => {
      condLog('CRC stream error encountered', funcName, fileName, area)
      reject(err)
    })

    crcStream.on('end', () => {
      condLog('Stream ending', funcName, fileName, area)
      // The CRC32 value as a hex string
      const checksum = crcStream.hex()
      resolve(checksum)
    })

    stream.pipe(crcStream)
  })

  exitLog(funcName, fileName, area)
  return checkSum
}

function generateMd5Checksum(pathToFile: string): Promise<string> {
  const funcName: string = 'generateMd5Checksum'
  entryLog(funcName, fileName, area)

  const checksum: Promise<string> = new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5')
    const stream = fs.createReadStream(pathToFile)

    stream.on('data', (data) => {
      condLog('Data received', funcName, fileName, area)
      hash.update(data)
    })
    stream.on('end', () => {
      condLog('Stream ending', funcName, fileName, area)
      resolve(hash.digest('hex'))
    })
    stream.on('error', (err) => {
      condLog('Error encountered', funcName, fileName, area)
      reject(err)
    })
  })

  exitLog(funcName, fileName, area)
  return checksum
}

function generateSha256Checksum(pathToFile: string): Promise<string> {
  const funcName: string = 'generateSha256Checksum'
  entryLog(funcName, fileName, area)

  const checksum: Promise<string> = new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    const stream = fs.createReadStream(pathToFile)

    stream.on('data', (data) => {
      condLog('Data received', funcName, fileName, area)
      hash.update(data)
    })
    stream.on('end', () => {
      condLog('Stream ending', funcName, fileName, area)
      resolve(hash.digest('hex'))
    })
    stream.on('error', (err) => {
      condLog('Error encountered', funcName, fileName, area)
      reject(err)
    })
  })

  exitLog(funcName, fileName, area)
  return checksum
}
export { CHECKSUM_TYPE }
