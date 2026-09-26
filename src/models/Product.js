import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        material: {
            type: String,
            default: "",
        },

        flair: {
            type: String,
            default: "",
        },

        blouse: {
            type: String,
            default: "",
        },

        dupatta: {
            type: String,
            default: "",
        },

        // colors: {
        //     type: [String],
        //     default: [],
        // },

        features: {
            type: [String],
            default: [],
        },

        images: {
            type: [String],
            default: [],
        },

        featured: {
            type: Boolean,
            default: false,
        },

        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;