import express from "express";
import { finalizar } from "../controllers/finishController.js";

const router = express.Router();

router.post("/finalizar", finalizar)

export default router;