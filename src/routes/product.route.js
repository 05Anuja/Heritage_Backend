import express from "express";
import { addProduct, deleteAllProducts, deleteProduct, getProductByCategory, getProductById, getProducts, updateProduct } from "../controllers/product.controller.js";
// import { UploadStream } from "cloudinary";
import upload from '../middleware/uploadMiddleware.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminOnly.js'

const router = express.Router();

// Public Routes
router.get('/', getProducts)
router.get('/category/:category', getProductByCategory)
router.get('/:id', getProductById)


// Admin only routes
router.post('/add-product', authMiddleware, adminOnly, upload.array('images', 5), addProduct)
router.patch('/update-product/:id', authMiddleware, adminOnly, upload.array('images', 5), updateProduct)
router.delete('/delete-product/:id', authMiddleware, adminOnly, deleteProduct)
router.delete('/delete-all', authMiddleware, adminOnly, deleteAllProducts)

export default router;