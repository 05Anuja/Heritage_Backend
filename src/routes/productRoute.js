import express from "express";
import { addProduct, getProductByCategory, getProductById, getProducts } from "../controllers/product.controller.js";
// import { UploadStream } from "cloudinary";
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router();

router.get('/', getProducts)
router.get('/:id', getProductById)
router.get('/:category', getProductByCategory)
router.post('/add-product', upload.array('images', 5), addProduct)

export default router;