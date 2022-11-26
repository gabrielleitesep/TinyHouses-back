import express from "express";
import { carrinho } from "../controllers/cartController.js";

const router = express.Router();

router.get("/carrinho", carrinho);

export default router;