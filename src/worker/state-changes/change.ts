const fileName: string = 'changes.ts'
const area: string = 'state-changes'

export enum CHANGE_TYPE {
  MODIFY_RULE = 'modify-rule',
  DELETE_RULE = 'delete-rule',
  STOP_RULE = 'stop-rule',
  DISABLE_RULE = 'disable-rule',
  EVALUATE_RULE = 'evaluate-rule',
  MODIFY_SETTINGS = 'modify-settings'
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
