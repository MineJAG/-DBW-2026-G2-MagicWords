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

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);
router.patch("/username", updateUsername);
router.patch("/picture", updatePicture);

export default router;