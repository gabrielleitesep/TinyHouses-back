import express from "express";
import { getProducts, productRegistration } from "../controllers/productsController.js";

const router = express.Router();

router.get("/get-products", getProducts);

router.post("/product-registration", productRegistration);

export default router;