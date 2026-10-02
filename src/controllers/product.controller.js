import { cloudinary } from "../config/cloudinary.js";
import Product from "../models/Product.js";

// Get All Products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({
            active: true
        }).sort({ createdAt: -1 })

        console.log("Products fetched successfully!")

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
        const { category } = req.params;
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
export const addProduct = async (req, res) => {
    try {
        const {
            name,
            category,
            description,
            material,
            flair,
            blouse,
            dupatta,
            features,
            featured,
            active,
        } = req.body;

        // validate fields
        if (!name || !category) {
            return res.status(400).json({
                message: "Name and category are required",
            });
        }

        // convert image to array and validate
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "At least one product image is required",
            });
        }

        // convert features to array
        let productFeatures = [];

        if (features) {
            if (Array.isArray(features)) {
                productFeatures = features;
            } else {
                productFeatures = [features];
            }
        }

        // convert featured to boolean
        const isFeatured = featured === "true";


        // convert active to boolean
        const isActive = active === undefined
            ? true
            : active === "true";

        // Upload images to Cloudinary
        const imageUrls = [];

        for (const file of req.files) {

            const result = await new Promise((resolve, reject) => {

                const uploadStream =
                    cloudinary.uploader.upload_stream(
                        {
                            folder: "heritage_bharat/products",
                        },
                        (err, result) => {

                            if (err) {
                                return reject(err);
                            }

                            return resolve(result);
                        }
                    );

                uploadStream.end(file.buffer);
            });

            imageUrls.push(result.secure_url);
        }

        // create product
        const product = await Product.create({
            name,
            category,
            description,
            material,
            flair,
            blouse,
            dupatta,

            features: productFeatures,

            images: imageUrls,

            featured: isFeatured,

            active: isActive,
        });

        console.log("Product added successfully")

        // response
        return res.status(201).json({
            message: "Product created successfully",
            product,
        });

    } catch (err) {

        console.error("Create Product Error:", err);

        return res.status(500).json({
            message: err.message,
        });
    }
};

// Update Product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, description, material, flair, blouse, dupatta, features, featured, active } = req.body;

        // Find existing product
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        // convert features
        let productFeatures = product.features;

        if (features !== undefined) {
            if (Array.isArray(features)) {
                productFeatures = features;
            } else {
                productFeatures = [features];
            }
        }

        // convert featured
        const isFeatured = featured === undefined ? product.featured : featured === "true" || featured === true;

        // convert active
        const isActive = active === undefined ? product.active : active === "true" || active === true;

        // Upload New Image
        let imageUrls = product.images;

        if (req.files && req.files.length > 0) {

            const newImageUrls = [];

            for (const file of req.files) {

                const result = await new Promise((resolve, reject) => {

                    const uploadStream =
                        cloudinary.uploader.upload_stream(
                            {
                                folder: "heritage_bharat/products",
                            },
                            (err, result) => {

                                if (err) {
                                    return reject(err);
                                }

                                return resolve(result);
                            }
                        );

                    uploadStream.end(file.buffer);
                });

                newImageUrls.push(result.secure_url);
            }

            // Add new image to existing image
            // imageUrls = [
            //     ...product.images,
            //     ...newImageUrls
            // ];

            // Replaced old images when new images are uploaded
            imageUrls = newImageUrls
        }

        // Update Product
        product.name = name ?? product.name;
        product.category = category ?? product.category;
        product.description = description ?? product.description;
        product.material = material ?? product.material;
        product.flair = flair ?? product.flair;
        product.blouse = blouse ?? product.blouse;
        product.dupatta = dupatta ?? product.dupatta;

        product.features = productFeatures;
        product.featured = isFeatured;
        product.active = isActive;
        product.images = imageUrls;

        await product.save();
        console.log("Product updated successfully!");

        return res.status(200).json({
            message: "Product updated successfully",
            product,
        });

    } catch (err) {

        console.error("Update Product Error:", err);

        return res.status(500).json({
            message: err.message,
        });
    }
};

// delete all products
export const deleteAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        if (!products || products.length === 0) {
            return res.status(404).json({
                message: "Product Not Found"
            })
        }

        await Product.deleteMany({});

        console.log("Products deleted successfully");
        return res.status(200).json({
            message: "Products deleted successfully"
        });
    } catch (err) {
        console.log("DeleteAll Error")
        return res.status(500).json({
            message: err.message,
        })
    }
}

// delete single product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id)
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product Not Found"
            });
        }
        await Product.findByIdAndDelete(id);
        console.log("Product deleted successfully");
        return res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (err) {
        console.log("Delete Product Error")
        return res.status(500).json({
            message: err.message,
        })
    }
}