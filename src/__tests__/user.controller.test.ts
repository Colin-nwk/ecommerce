// import { prismaClient } from "..";
// import { signup, login, me } from "../controllers/auth.controller";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "../secrets";
// import { BADRequestException } from "../exceptions/bad-requests";
// import { ErrorCodes } from "../exceptions/root";
// import { UnprocessableEntity } from "../exceptions/validation";
// import { NotFoundException } from "../exceptions/not-found";
// import { describe, it } from "node:test";

// describe("Auth Controller", () => {
//   describe("signup", () => {
//     it("should create a new user", async () => {
//       const req = {
//         body: {
//           email: "test@example.com",
//           password: "password",
//           name: "Test User",
//         },
//       };
//       const res = {
//         json: jest.fn(),
//       };
//       const next = jest.fn();

//       await signup(req, res, next);

//       const user = await prismaClient.user.findFirst({
//         where: { email: req.body.email },
//       });
//       expect(user).toBeDefined();
//       expect(bcrypt.compareSync(req.body.password, user.password)).toBe(true);
//       expect(res.json).toHaveBeenCalledWith(user);
//     });

//     it("should return an error if user already exists", async () => {
//       const req = {
//         body: {
//           email: "test@example.com",
//           password: "password",
//           name: "Test User",
//         },
//       };
//       const res = {
//         json: jest.fn(),
//       };
//       const next = jest.fn();

//       await prismaClient.user.create({
//         data: {
//           email: req.body.email,
//           password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
//           name: req.body.name,
//         },
//       });

//       await signup(req, res, next);

//       expect(next).toHaveBeenCalledWith(
//         new BADRequestException(
//           "User already exists",
//           ErrorCodes.USER_ALREADY_EXIST
//         )
//       );
//     });

//     it("should return an error if request body is invalid", async () => {
//       const req = {
//         body: {
//           email: "invalid-email",
//           password: "short",
//           name: "",
//         },
//       };
//       const res = {
//         json: jest.fn(),
//       };
//       const next = jest.fn();

//       await signup(req, res, next);

//       expect(next).toHaveBeenCalledWith(expect.any(UnprocessableEntity));
//     });
//   });

//   describe("login", () => {
//     it("should login a user with valid credentials", async () => {
//       const email = "test@example.com";
//       const password = "password";
//       const user = await prismaClient.user.create({
//         data: {
//           email,
//           password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
//           name: "Test User",
//         },
//       });

//       const req = {
//         body: {
//           email,
//           password,
//         },
//       };
//       const res = {
//         json: jest.fn(),
//       };
//       const next = jest.fn();

//       await login(req, res, next);

//       const token = jwt.sign({ userId: user.id }, JWT_SECRET);
//       expect(res.json).toHaveBeenCalledWith({ user, token });
//     });

//     it("should return an error if user does not exist", async () => {
//       const req = {
//         body: {
//           email: "nonexistent@example.com",
//           password: "password",
//         },
//       };
//       const res = {
//         json: jest.fn(),
//       };
//       const next = jest.fn();

//       await login(req, res, next);

//       expect(next).toHaveBeenCalledWith(
//         new NotFoundException("User does not exist", ErrorCodes.USER_NOT_FOUND)
//       );
//     });

//     it("should return an error if password is incorrect", async () => {
//       const email = "test@example.com";
//       const password = "password";
//       await prismaClient.user.create({
//         data: {
//           email,
//           password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
//           name: "Test User",
//         },
//       });

//       const req = {
//         body: {
//           email,
//           password: "wrongpassword",
//         },
//       };
//       const res = {
//         json: jest.fn(),
//       };
//       const next = jest.fn();

//       await login(req, res, next);

//       expect(next).toHaveBeenCalledWith(
//         new BADRequestException(
//           "Invalid credentials",
//           ErrorCodes.INCORRECT_PASSWORD
//         )
//       );
//     });
//   });

//   describe("me", () => {
//     it("should return the authenticated user", async () => {
//       const user = {
//         id: 1,
//         email: "test@example.com",
//         name: "Test User",
//       };
//       const req = {
//         user,
//       };
//       const res = {
//         json: jest.fn(),
//       };

//       await me(req, res);

//       expect(res.json).toHaveBeenCalledWith(user);
//     });
//   });
// });
