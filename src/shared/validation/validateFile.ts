const RESERVED_WINDOWS_FILE_NAMES: string[] = [
  'CON',
  'PRN',
  'AUX',
  'NUL',
  ...Array.from({ length: 10 }, (_, i) => `COM${i}`),
  ...Array.from({ length: 10 }, (_, i) => `LPT${i}`)
]

const INVALID_FILE_NAME_FILTER_CHARS: RegExp = /[\/\\:?"><|]/

const ONLY_EDGE_ASTERISKS: RegExp = /^(?:\*?)[^*]*?(?:\*?)$/

const ASCII_CONTROL_CHARACTERS: RegExp = /[\x00-\x1F]/

const ENDS_WITH_DOT_OR_SPACE: RegExp = /[. ]$/

// Validates strings are valid files name filters
// - Can be a full file name
// - Can include asterisks (*) to denote anything before or after the asterisk
//
// Cant have logs - Used in all processes
export function validateFileNameFilter(fileNameFilter: string): boolean {
  if (RESERVED_WINDOWS_FILE_NAMES.includes(fileNameFilter.toUpperCase())) {
    return false
  }

  if (INVALID_FILE_NAME_FILTER_CHARS.test(fileNameFilter)) {
    return false
  }

  if (!ONLY_EDGE_ASTERISKS.test(fileNameFilter)) {
    return false
  }

  if (ASCII_CONTROL_CHARACTERS.test(fileNameFilter)) {
    return false
  }

  if (ENDS_WITH_DOT_OR_SPACE.test(fileNameFilter)) {
    return false
  }

  return true
}
