import Enquiry from "../models/Enquiry.js";

export const createEnquiry = async (req, res) => {
    try {
        const { name, email, phoneNo, message } = req.body;
        if (!name || !email || !phoneNo || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, Email, Phone No, Message is required!"
            })
        }

        const enquiry = await Enquiry.create({
            name, email, phoneNo, message
        })

        return res.status(201).json({
            success: true,
            message: "Enquiry created successfully",
            enquiry
        });
    } catch (err) {
        console.log("Enquiry Error")
        return res.status(500).json({
            success: false,
            message: "Enquiry creation failed"
        })
    }
}