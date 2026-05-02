"use strict";

import express from "express";
import { register, logout, me } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/logout", logout);
router.get("/me", me);

export default router;