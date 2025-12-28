const INVALID_WINDOWS_DIR_NAME_CHARS = /[<>:"/\\|?*\x00-\x1F]/g

const INVALID_DIR_NAME_FILTER_CHARS = /[/\\:?"><|]/

const INVALID_MAC_DIR_NAME_CHARS = /[:]/g

const RESERVED_WINDOWS_DIR_NAMES: string[] = [
  'CON',
  'PRN',
  'AUX',
  'NUL',
  ...Array.from({ length: 10 }, (_, i) => `COM${i}`),
  ...Array.from({ length: 10 }, (_, i) => `LPT${i}`)
]

const ONLY_EDGE_ASTERISKS = /^(?:\*?)[^*]*?(?:\*?)$/

const ASCII_CONTROL_CHARACTERS = /[\x00-\x1F]/

const ENDS_WITH_DOT_OR_SPACE = /[. ]$/

// Make sure the directory name is valid in noth windows and mac
export function validateDirectoryName(directoryName: string): boolean {
  if (directoryName.length < 1) {
    return false
  }

  if (INVALID_WINDOWS_DIR_NAME_CHARS.test(directoryName)) {
    return false
  }

  if (INVALID_MAC_DIR_NAME_CHARS.test(directoryName)) {
    return false
  }

  if (RESERVED_WINDOWS_DIR_NAMES.includes(directoryName.toLocaleUpperCase())) {
    return false
  }

  if (ASCII_CONTROL_CHARACTERS.test(directoryName)) {
    return false
  }

  if (ENDS_WITH_DOT_OR_SPACE.test(directoryName)) {
    return false
  }

  return true
}

// Make sure each segment of a partial directory path is valid
// - This path does not include the root of the path. i.e. C:// on windows
//
// Cant have logs - Used in all processes
export function validatePartialDirectoryPath(partialDirectoryPath: string): boolean {
  const directoryNames: string[] = partialDirectoryPath.split(/[/\\]/).filter(Boolean)
  for (const directoryName of directoryNames) {
    if (!validateDirectoryName(directoryName)) {
      return false
    }
  }

  return true
}

// Validates strings are valid dir name filters
// - Can be a full dir name
// - Can include asterisks (*) to denote anything before or after the asterisk
//
// Cant have logs - Used in all processes
export function validateDirNameFilter(dirNameFilter: string): boolean {
  if (RESERVED_WINDOWS_DIR_NAMES.includes(dirNameFilter.toUpperCase())) {
    return false
  }

  if (INVALID_DIR_NAME_FILTER_CHARS.test(dirNameFilter)) {
    return false
  }

  if (!ONLY_EDGE_ASTERISKS.test(dirNameFilter)) {
    return false
  }

  if (ASCII_CONTROL_CHARACTERS.test(dirNameFilter)) {
    return false
  }

  if (ENDS_WITH_DOT_OR_SPACE.test(dirNameFilter)) {
    return false
  }

  return true
}
