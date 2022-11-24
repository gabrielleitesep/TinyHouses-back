import express from "express";
import { getProducts } from "../controllers/productsController.js";

const router = express.Router();

router.get("/get-products", getProducts);

export default router;