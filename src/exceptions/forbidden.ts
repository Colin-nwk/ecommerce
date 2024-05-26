import { HttpException } from "./root";

export class ForbiddenException extends HttpException {
  constructor(message: string, errorCode: number, errors: any) {
    super(message, 403, errorCode, null);
  }
}
