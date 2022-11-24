import express from "express";
import { productRegistration } from "../controllers/productRegistrationController.js";

const router = express.Router();

router.post("/product-registration", productRegistration);

export default router;