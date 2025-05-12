// Set the loggers to not be dev - stops all logging for production

const fs = require('fs')
const path = require('path')

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
