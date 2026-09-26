import Product from "../models/Product.js";

// Get All Products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({
            active: true
        }).sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            count: products.length,
            products,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: err.message,
        })
    }
}

// Get single product
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product,
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
            error: err.message,
        })
    }
}

// Get product by category
export const getProductByCategory = async (req, res) => {
    try {
        const { category } = req.params.category;
        const product = await Product.find({
            category: category,
            active: true,
        })

        res.status(200).json({
            success: true,
            message: `Products fetched successfully`,
            count: product.length,
            product
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
            error: err.message,
        })
    }
}

// CREATE product
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create product",
            error: error.message,
        });
    }
};