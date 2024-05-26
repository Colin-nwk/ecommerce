import { HttpException } from "./root";

export class UnauthorizedException extends HttpException {
  constructor(message: string, errorCode: number) {
    super(message, 401, errorCode, null);
  }
}
