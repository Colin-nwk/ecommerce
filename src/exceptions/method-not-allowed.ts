import { HttpException } from "./root";

export class MethodNotAllowedException extends HttpException {
  constructor(message: string, errorCode: number) {
    super(message, 405, errorCode, null);
  }
}
