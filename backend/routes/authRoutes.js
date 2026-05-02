"use strict";

import express from "express";
import { register, me } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.get("/me", me);

export default router;