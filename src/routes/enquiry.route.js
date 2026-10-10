import express from "express";
import { createEnquiry, getEnquiry } from "../controllers/enquiry.controller.js";

const router = express.Router();

router.post('/', createEnquiry);
router.get('/', getEnquiry);

export default router;