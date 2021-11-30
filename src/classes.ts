export class NotImplementedError extends Error {
  constructor(method: string) {
    super(`method .${method}() is not implemented`)
  }
}
