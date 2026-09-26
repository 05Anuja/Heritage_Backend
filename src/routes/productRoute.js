import express from "express";
import { getProductByCategory, getProductById, getProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.get('/', getProducts)
router.get('/:id', getProductById)
router.get('/:category', getProductByCategory)

export default router;