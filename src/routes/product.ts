import { Router } from "express";
import { errorHandler } from "../error-handler";
import { authMiddleware } from "../middlewares/auth";
import { createProduct } from "../controllers/product.controller";

const productRoutes: Router = Router();

productRoutes.post("/", errorHandler(createProduct));

export default productRoutes;
