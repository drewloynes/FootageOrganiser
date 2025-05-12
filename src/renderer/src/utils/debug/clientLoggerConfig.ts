import { CLIENT_LOG_LEVEL } from './clientLogger'

// String arrays allowing filter in of logs based on:
// - dev: If were running in dev mode or not
// - level: e.g. error, warn etc
// - func: function name
// - file: file name
// - area: area
// (Empty array filters all in)
type ClientLoggingConfiguration = {
  dev: boolean
  level: CLIENT_LOG_LEVEL[]
  func: string[]
  file: string[]
  area: string[]
}

const CLIENT_LOG_CONFIG: ClientLoggingConfiguration = {
  dev: false,
  level: [],
  func: [],
  file: [],
  area: []
}

export default CLIENT_LOG_CONFIG
