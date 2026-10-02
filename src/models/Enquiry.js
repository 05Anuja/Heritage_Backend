import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        phoneNo: {
            type: String,
            required: true,
            trim: true,
            match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"]
        },
        message: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;