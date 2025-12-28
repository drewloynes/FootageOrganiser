// Set the loggers to not be dev - stops all logging for production

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const filesToModify = [
  '../src/shared-node/debug/loggerConfig.ts',
  '../src/renderer/src/utils/debug/clientLoggerConfig.ts'
]

filesToModify.forEach((relativeFilePath) => {
  const filePath = path.resolve(__dirname, relativeFilePath)

  try {
    let content = fs.readFileSync(filePath, 'utf8')

    const updatedContent = content.replace(/(\bdev:\s*)true\b/, '$1false')

    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8')
      console.log(`Updated: ${filePath}`)
    } else {
      console.log(`No change needed: ${filePath}`)
    }
  } catch (err) {
    console.error(`Error processing file ${filePath}: ${err.message}`)
  }
})
