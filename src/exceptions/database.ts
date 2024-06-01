import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

// import prismaClient from "../app";

export const handleDatabaseErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    switch (err.code) {
      case "P2002":
        // Unique constraint violation
        console.error("Unique constraint violation:", err.message);
        return res.status(409).json({ error: "Unique constraint violation" });
      case "P2025":
        // Record not found
        console.error("Record not found:", err.message);
        return res.status(404).json({ error: "Record not found" });
      case "P2003":
        // Foreign key constraint violation
        console.error("Foreign key constraint violation:", err.message);
        return res
          .status(409)
          .json({ error: "Foreign key constraint violation" });
      case "P2016":
        // Missing a required value
        console.error("Missing a required value:", err.message);
        return res.status(400).json({ error: "Missing a required value" });
      default:
        console.error("Database error:", err.message);
        return res.status(500).json({ error: "Database error" });
    }
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    // Handle unknown Prisma errors
    console.error("Unknown database error:", err.message);
    return res.status(500).json({ error: "Unknown database error" });
  }

  // Pass the error to the next error-handling middleware
  next(err);
};
