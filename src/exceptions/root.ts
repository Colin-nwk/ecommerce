// message, status code, error codes,error

export class HttpException extends Error {
  message: string;
  errorCode: ErrorCodes;
  statusCode: number;
  errors: any;

  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCodes,
    errors: any
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}

export enum ErrorCodes {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXIST = 1002,
  INCORRENT_PASSWORD = 1003,
  UNPROCESSABLE_ENTITY = 2001,
  INTERNAL_EXCEPTIONS = 3001,
}
