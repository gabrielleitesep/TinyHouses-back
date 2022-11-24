import express from "express";
import { loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

router.post ("/login-admin", loginAdmin);

export default router;