import express from "express";
import { listarCarrinho, inserirCarrinho, deletarCarrinho } from "../controllers/cartController.js";

const router = express.Router();

router.get("/carrinho", listarCarrinho);
router.post("/carrinho", inserirCarrinho)
router.delete("/carrinho", deletarCarrinho)

export default router;