import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../app";
import { ProductSchema } from "../schema/products";
import { UnprocessableEntity } from "../exceptions/validation";
import { ErrorCodes } from "../exceptions/root";
import { NotFoundException } from "../exceptions/not-found";
import { AddressSchema, updateUserSchema } from "../schema/users";
import { Address, User } from "@prisma/client";
import { BADRequestException } from "../exceptions/bad-requests";

export const addAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parseResult = AddressSchema.safeParse(req.body);
  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.json(address);
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    await prismaClient.address.delete({
      where: { id: +id },
    });
  } catch (error) {
    throw new NotFoundException("Address not found", ErrorCodes.NOT_FOUND);
  }

  res.json({ success: true }).status(204);
};
export const listAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const addresses = await prismaClient.address.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.json(addresses);
};
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parseResult = updateUserSchema.safeParse(req.body);
  let shippingAddress: Address;
  let billingAddress: Address;

  if (parseResult.success) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: parseResult.data.defaultShippingAddressId,
        },
      });
    } catch (error) {
      throw new NotFoundException("Address not Found", ErrorCodes.NOT_FOUND);
    }
    if (shippingAddress.userId != req.user.id) {
      throw new BADRequestException(
        "Address does not belong to the user",
        ErrorCodes.UNAUTHORIZED
      );
    }

    if (parseResult.data.defaultBillingAddressId) {
      try {
        billingAddress = await prismaClient.address.findFirstOrThrow({
          where: {
            id: parseResult.data.defaultBillingAddressId,
          },
        });
      } catch (error) {
        throw new NotFoundException("Address not Found", ErrorCodes.NOT_FOUND);
      }
      if (billingAddress.userId != req.user.id) {
        throw new BADRequestException(
          "Address does not belong to the user",
          ErrorCodes.UNAUTHORIZED
        );
      }
    }
  }
  const updateUser = await prismaClient.user.update({
    where: { id: req.user.id },
    data: parseResult.data,
  });
  res.json(updateUser);
};
