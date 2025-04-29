export interface PromiseResolveRejectTimer {
  resolve: (value: unknown) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void
  timer: NodeJS.Timeout
}

export interface PromiseResolveTimer {
  resolve: (value: unknown) => void
  timer: NodeJS.Timeout
}
