// import { NextFunction, Request, Response } from "express";
// import { ErrorCodes, HttpException } from "./exceptions/root";
// import { InternalException } from "./exceptions/internal-exception";
// import { ZodError } from "zod";
// import { BADRequestException } from "./exceptions/bad-requests";

// export const errorHandler = (method: Function) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await method(req, res, next);
//     } catch (error: any) {
//       let exception: HttpException;
//       if (error instanceof HttpException) {
//         exception = error;
//       } else {
//         if (error instanceof ZodError) {
//           exception = new BADRequestException(
//             "unprocessable entity",
//             ErrorCodes.UNPROCESSABLE_ENTITY
//           );
//         }
//         exception = new InternalException(
//           "Something went wrong!",
//           ErrorCodes.INTERNAL_EXCEPTIONS,
//           error
//         );
//       }
//       next(exception);
//     }
//   };
// };

import { NextFunction, Request, Response } from "express";
import { ErrorCodes, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";
import { ZodError } from "zod";
import { BADRequestException } from "./exceptions/bad-requests";
import { Prisma } from "@prisma/client";
import { MethodNotAllowedException } from "./exceptions/method-not-allowed";
import { UnprocessableEntity } from "./exceptions/validation";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpException;

      switch (true) {
        case error instanceof HttpException:
          exception = error;
          break;
        case error instanceof ZodError:
          exception = new UnprocessableEntity(
            "unprocessable entity",
            ErrorCodes.UNPROCESSABLE_ENTITY,
            error.flatten()
          );
          break;
        case error instanceof Prisma.PrismaClientKnownRequestError:
          // Handle known Prisma errors
          if (error.code === "P2025") {
            // Record not found
            exception = new BADRequestException(
              "Record not found",
              ErrorCodes.UNPROCESSABLE_ENTITY
            );
          } else {
            // Other Prisma errors
            exception = new InternalException(
              "Database error",
              ErrorCodes.INTERNAL_EXCEPTIONS,
              error
            );
          }
          break;
        case error.name === "MethodNotAllowedException":
          exception = new MethodNotAllowedException(
            "Method not allowed",
            ErrorCodes.METHOD_NOT_ALLOWED
          );
          break;
        default:
          exception = new InternalException(
            "Something went wrong!",
            ErrorCodes.INTERNAL_EXCEPTIONS,
            error
          );
          break;
      }

      next(exception);
    }
  };
};
