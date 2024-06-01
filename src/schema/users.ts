import { z } from "zod";
import { updateUser } from "../controllers/user.controller";

export const SignUpSchema = z.object({
  email: z.string({ message: "email is required" }).email(),
  password: z
    .string({ message: "password is required" })
    .min(4, "password must be at least 4 characters"),
  name: z.string({ message: "name is required" }),
});

export const LoginSchema = z.object({
  email: z
    .string({ message: "email is required" })
    .email({ message: "invalid email" }),
  password: z.string({ message: "password is required" }),
});

export const AddressSchema = z.object({
  lineOne: z.string({ message: "line one address is required" }),
  lineTwo: z.string({ message: "line two address is required" }),
  city: z.string({ message: "city is required" }),
  country: z.string({ message: "country is required" }),
  pincode: z
    .string({ message: "pincode is required" })
    .length(6, "pincode must be 6 characters long"),
  // userId: z.number({ message: "user Id is required" }).int().positive(),
});

export type Address = z.infer<typeof AddressSchema>;

export const updateUserSchema = z.object({
  name: z.string().optional(),
  defaultBillingAddressId: z.number().optional(),
  defaultShippingAddressId: z.number().optional(),
});
