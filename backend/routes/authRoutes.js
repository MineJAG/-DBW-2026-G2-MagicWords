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

/**
 * Auth router. Mounted at `/api/auth` in the main app.
 *
 * Routes:
 * - `POST /register` — create a new account. Public.
 * - `POST /login` — exchange credentials for an auth cookie. Public.
 * - `POST /logout` — clear the auth cookie. Public (no-op when not logged in).
 * - `GET  /me` — return the current user. Requires auth.
 * - `PATCH /username` — change the current user's username. Requires auth.
 * - `PATCH /picture` — change the current user's profile picture. Requires auth.
 *
 * @type {import("express").Router}
 */
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.patch("/username", requireAuth, updateUsername);
router.patch("/picture", requireAuth, updatePicture);

export default router;
