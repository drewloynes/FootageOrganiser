import * as fs from 'fs'

fs.copyFileSync(
  'C:\\Users\\drewl\\Downloads\\2024\\12-December\\1\\Windows\\received_839345481484866-small.jpeg',
  'C:\\Users\\drewl\\Downloads\\2024\\12-December\\1\\Windows\\received_839345481484866-small - Copy.jpeg',
  fs.constants.COPYFILE_EXCL
)
