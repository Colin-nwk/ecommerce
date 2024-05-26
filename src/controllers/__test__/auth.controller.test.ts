import request from "supertest";
import app from "../../app";
import { prismaClient } from "../../app";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../secrets";
import { $Enums } from "@prisma/client";

describe("User Controller", () => {
  let validUser: {
    email: string;
    id: number;
    name: string;
    password?: string;
    role?: $Enums.Role;
    createdAt?: Date;
    updatedAt?: Date;
  };

  beforeAll(async () => {
    // Create a valid user in the database for testing
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("password", salt);
    validUser = await prismaClient.user.create({
      data: { email: "test@example.com", name: "Test User", password: hash },
    });
  });

  afterAll(async () => {
    // Clean up the database after tests
    await prismaClient.user.deleteMany();
  });

  describe("POST /signup", () => {
    it("should create a new user", async () => {
      const response = await request(app).post("/api/auth/signup").send({
        email: "newuser@example.com",
        password: "newpassword",
        name: "New User",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("email", "newuser@example.com");
      expect(response.body).toHaveProperty("name", "New User");
    });

    it("should return 422 for invalid request body", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({ email: "invalid", password: "short" });

      expect(response.statusCode).toBe(422);
      expect(response.body).toHaveProperty("errors");
    });

    it("should return 400 for existing user", async () => {
      const response = await request(app).post("/api/auth/signup").send({
        email: validUser.email,
        password: "password",
        name: "Test User",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body).toHaveProperty("message", "User already exists");
    });
  });

  describe("POST /login", () => {
    it("should authenticate and return a token", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: validUser.email, password: "password" });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
    });

    it("should return 404 for non-existent user", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "nonexistent@example.com", password: "password" });

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("errors");
      expect(response.body).toHaveProperty("message", "User does not exist");
    });

    it("should return 400 for invalid credentials", async () => {
      const response = await request(app)
        .post("/login")
        .send({ email: validUser.email, password: "wrongpassword" });

      expect(response.statusCode).toBe(400);
      // expect(response.body).toHaveProperty("message", "Invalid credentials");
    });
  });

  describe("GET /me", () => {
    let token: string;

    beforeAll(async () => {
      // Generate a valid JWT token for testing
      token = jwt.sign({ userId: validUser.id }, JWT_SECRET);
    });

    it("should return user information", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: validUser.id,
        email: validUser.email,
        name: validUser.name,
      });
    });

    it("should return 401 for invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid_token");

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("errors");
    });
  });
});
