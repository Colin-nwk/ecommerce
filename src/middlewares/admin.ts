import { ErrorCodes } from "../exceptions/root";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user.role === "ADMIN") {
    next();
    return;
  }
  next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
  return;
};
