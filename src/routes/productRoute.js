import express from "express";
import { addProduct, getProductByCategory, getProductById, getProducts, updateProduct } from "../controllers/product.controller.js";
// import { UploadStream } from "cloudinary";
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router();

router.get('/', getProducts)
router.get('/:id', getProductById)
router.get('/:category', getProductByCategory)
router.post('/add-product', upload.array('images', 5), addProduct)
router.patch('/update-product/:id', upload.array('images', 5),updateProduct)

export default router;