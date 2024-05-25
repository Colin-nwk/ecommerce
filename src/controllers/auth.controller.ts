import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BADRequestException } from "../exceptions/bad-requests";
import { ErrorCodes } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { SignUpSchema } from "../schema/users";
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // try {
  //   SignUpSchema.parse(req.body);
  //   const { email, password, name } = req.body;

  //   if (!password || typeof password !== "string") {
  //     return res.status(400).json({ error: "Password is required" });
  //   }
  //   const salt = bcrypt.genSaltSync(10);
  //   const hash = bcrypt.hashSync(password, salt);
  //   let user = await prismaClient.user.findFirst({ where: { email } });

  //   if (user) {
  //     next(
  //       new BADRequestException(
  //         "User already exists",
  //         ErrorCodes.USER_ALREADY_EXIST
  //       )
  //     );
  //   }

  //   user = await prismaClient.user.create({
  //     data: { email, name, password: hash },
  //   });
  //   res.json(user);
  // } catch (error: any) {
  //   if (error instanceof BADRequestException) {
  //     next(error);
  //   } else {
  //     next(
  //       new UnprocessableEntity(
  //         "Unprocessable Entity",
  //         ErrorCodes.UNPROCESSABLE_ENTITY,
  //         error?.issues
  //       )
  //     );
  //   }
  // }

  SignUpSchema.parse(req.body);
  const { email, password, name } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  let user = await prismaClient.user.findFirst({ where: { email } });

  if (user) {
    next(
      new BADRequestException(
        "User already exists",
        ErrorCodes.USER_ALREADY_EXIST
      )
    );
  }

  user = await prismaClient.user.create({
    data: { email, name, password: hash },
  });
  res.json(user);
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await prismaClient.user.findFirst({ where: { email } });

  if (!user) {
    next(
      new BADRequestException("User does not exist", ErrorCodes.USER_NOT_FOUND)
    );
    return;
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw Error("invalid credentials");
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET) as string;
  res.json({ user, token });
};
