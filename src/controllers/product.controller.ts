import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../app";
import { ProductSchema } from "../schema/products";
import { UnprocessableEntity } from "../exceptions/validation";
import { ErrorCodes } from "../exceptions/root";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parseResult = ProductSchema.safeParse(req.body);

  if (!parseResult.success) {
    next(
      new UnprocessableEntity(
        "unprocessable entity",
        ErrorCodes.UNPROCESSABLE_ENTITY,
        parseResult.error.flatten()
      )
    );
  }

  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });

  res.json(product);
};
