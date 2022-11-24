import express from "express";
import { loginAdmin, logoutAdmin } from "../controllers/adminController.js";

const router = express.Router();

router.post ("/login-admin", loginAdmin);

router.delete ("/logout-admin", logoutAdmin);

export default router;