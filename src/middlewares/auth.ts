import { ErrorCodes } from "../exceptions/root";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "../app";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
    // return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;

    const user = await prismaClient.user.findFirst({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
      //   return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
    // return;
  }
};
