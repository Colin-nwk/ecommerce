import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string({ message: "email is required" }).email(),
  password: z
    .string({ message: "password is required" })
    .min(4, "password must be at least 4 characters"),
  name: z.string({ message: "name is required" }),
});
