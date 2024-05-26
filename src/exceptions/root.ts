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
  //   USER_NOT_FOUND = 1001,
  //   USER_ALREADY_EXIST = 1002,
  //   INCORRENT_PASSWORD = 1003,
  //   UNPROCESSABLE_ENTITY = 2001,
  //   INTERNAL_EXCEPTIONS = 3001,

  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXIST = 1002,
  INCORRECT_PASSWORD = 1003,
  CONTENT_ALREADY_EXIST = 1004,
  CONTENT_NOT_FOUND = 1005,
  UNPROCESSABLE_ENTITY = 2001,
  INTERNAL_EXCEPTIONS = 3001,
  UNAUTHORIZED = 4001,
  FORBIDDEN = 4003,
  NOT_FOUND = 4004,
  METHOD_NOT_ALLOWED = 4005,
  REQUEST_TIMEOUT = 4008,
  CONFLICT = 4009,
  UNSUPPORTED_MEDIA_TYPE = 4015,
}
