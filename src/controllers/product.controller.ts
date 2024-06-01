import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../app";
import { ProductSchema } from "../schema/products";
import { UnprocessableEntity } from "../exceptions/validation";
import { ErrorCodes } from "../exceptions/root";
import { NotFoundException } from "../exceptions/not-found";

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
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = req.body;
    if (product.tags) {
      product.tags = product.tags.join(",");
    }

    const updatedProduxt = await prismaClient.product.update({
      where: { id: +req.params.id },
      data: product,
    });

    res.json(updatedProduxt);
  } catch (error) {
    throw new NotFoundException("Product not found", ErrorCodes.NOT_FOUND);
  }
};
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedProduct = await prismaClient.product.delete({
      where: { id: +id },
    });
    res.json(deletedProduct);
  } catch (error) {
    throw new NotFoundException("Product not found", ErrorCodes.NOT_FOUND);
  }
};
export const listProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const count = await prismaClient.product.count();
  const products = await prismaClient.product.findMany({
    skip: +req.query.skip || 0,
    take: +req.query.take || 10,
  });
  res.json({ count, products });
};
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const product = await prismaClient.product.findUnique({
      where: { id: +id },
    });
    res.json(product);
  } catch (error) {
    throw new NotFoundException("Product not found", ErrorCodes.NOT_FOUND);
  }
  // const product = await prismaClient.product.findUnique({
  //   where: { id: +id },
  // });
  // if (!product) {
  //   throw new NotFoundException("Product not found", ErrorCodes.NOT_FOUND);
  // }
  // res.json(product);
};
