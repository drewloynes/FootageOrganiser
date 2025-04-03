import * as fs from 'fs'

// const data = 'First line\n'

// fs.appendFileSync('C:\\Users\\drewl\\Downloads\\file.log', data, 'utf-8')

// Get file path - logs / Month-Day / ruleName.log
const currentYear = new Date().getFullYear()
const date = new Date('January-23-2025')
const currentDate = new Date()

console.log(date)
console.log(currentDate)
const diffTime = date.getTime() - currentDate.getTime()
console.log(diffTime)
const diffDays = diffTime / (1000 * 60 * 60 * 24)
console.log(diffDays)
