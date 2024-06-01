import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../app";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BADRequestException } from "../exceptions/bad-requests";
import { ErrorCodes } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { LoginSchema, SignUpSchema } from "../schema/users";
// import { ZodIssue } from "zod";
import { NotFoundException } from "../exceptions/not-found";
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parseResult = SignUpSchema.safeParse(req.body);

  if (!parseResult.success) {
    next(
      new UnprocessableEntity(
        "unprocessable entity",
        ErrorCodes.UNPROCESSABLE_ENTITY,
        // parseResult.error.format()
        parseResult.error.flatten()
        // parseResult.error.flatten((issue: ZodIssue) => ({
        //   message: issue.message,
        // }))
      )
    );
  }

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
    return;
  }

  const created_user = await prismaClient.user.create({
    data: { email, name, password: hash },
    select: { id: true, email: true, name: true, role: true },
  });
  res.json(created_user);
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  LoginSchema.parse(req.body);

  const { email, password } = req.body;

  const user = await prismaClient.user.findFirst({ where: { email } });

  if (!user) {
    next(
      new NotFoundException("User does not exist", ErrorCodes.USER_NOT_FOUND)
    );
    return;
  }

  if (!bcrypt.compareSync(password, user.password)) {
    next(
      new BADRequestException(
        "Invalid credentials",
        ErrorCodes.INCORRECT_PASSWORD
      )
    );
    return;
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET) as string;
  const account = await findUserByEmail(user.email);
  res.json({ account, token });
};
export const me = async (req: Request, res: Response) => {
  const account = await findUserByEmail(req.user.email);
  console.log(req.user.email);
  res.json(account);
};

const findUserByEmail = async (email: string) => {
  const user = await prismaClient.user.findFirst({
    where: { email },
    select: { id: true, email: true, name: true, role: true },
  });
  return user;
};
