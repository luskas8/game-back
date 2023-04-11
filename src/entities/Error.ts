class BaseError extends Error {
  public readonly name: string
  public readonly httpCode: Http.StatusCode
  public readonly isOperational: boolean

  constructor(name: string, httpCode: Http.StatusCode, description: string, isOperational: boolean) {
    super("\x1b".concat(description).concat("\x1b[37m"))
    Object.setPrototypeOf(this, new.target.prototype)

    this.name = name
    this.httpCode = httpCode
    this.isOperational = isOperational

    Error.captureStackTrace(this)
  }
}

export class APIError extends BaseError {
  constructor(name: string, httpCode = Http.StatusCode.INTERNAL_SERVER, description = "Internal server error", isOperational = true) {
    super(name, httpCode, description, isOperational)
  }
}

export class HTTP400Error extends BaseError {
  constructor(description = 'bad request') {
    super('NOT FOUND', Http.StatusCode.BAD_REQUEST, description, true);
  }
}

export function isTrustedError(error: Error): boolean {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
}
