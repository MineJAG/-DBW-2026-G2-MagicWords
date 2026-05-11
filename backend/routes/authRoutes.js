"use strict";

import express from "express";
import {
  register,
  login,
  logout,
  me,
  updateUsername,
  updatePicture,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.patch("/username", requireAuth, updateUsername);
router.patch("/picture", requireAuth, updatePicture);

export default router;
