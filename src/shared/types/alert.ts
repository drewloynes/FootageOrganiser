const fileName: string = 'alert.ts'
const area: string = 'types'

export class Alert {
  title: string
  message: string

  constructor(title: string, message: string) {
    this.title = title
    this.message = message
  }
}
