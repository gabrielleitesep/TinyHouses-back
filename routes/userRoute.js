import express from "express";
import { cadastro, login, logout } from "../controllers/userController.js";

const router = express.Router();

router.post("/cadastro", cadastro);
router.post("/login", login);
router.delete("/logout", logout);

export default router;