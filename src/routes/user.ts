import { Router } from "express";
import { errorHandler } from "../error-handler";
import { authMiddleware } from "../middlewares/auth";
import {
  addAddress,
  deleteAddress,
  listAddress,
  updateUser,
} from "../controllers/user.controller";

const userRoutes: Router = Router();

userRoutes.post("/address", [authMiddleware], errorHandler(addAddress));

userRoutes.delete(
  "/address/:id",
  [authMiddleware],
  errorHandler(deleteAddress)
);
userRoutes.get("/address", [authMiddleware], errorHandler(listAddress));

userRoutes.put("/", [authMiddleware], errorHandler(updateUser));

export default userRoutes;
