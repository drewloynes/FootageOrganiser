export class IpcMessage {
  id: string
  data: unknown

  constructor(id: string, data: unknown) {
    this.id = id
    this.data = data
  }
}
