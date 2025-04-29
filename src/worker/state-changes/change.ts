const fileName: string = 'changes.ts'
const area: string = 'state-changes'

export enum CHANGE_TYPE {
  ADD_RULE = 'add-rule',
  MODIFY_RULE = 'modify-rule',
  DELETE_RULE = 'delete-rule',
  MODIFY_SETTINGS = 'modify-settings',
  EVALUTE_ALL_RULES = 'evaluate-all-rules'
}

export class Change {
  type: CHANGE_TYPE
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataForChange: any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(type: CHANGE_TYPE, dataForChange: any) {
    const funcName: string = 'Change Constructor'
    entryLog(funcName, fileName, area)

    this.type = type
    this.dataForChange = dataForChange

    exitLog(funcName, fileName, area)
    return
  }
}
