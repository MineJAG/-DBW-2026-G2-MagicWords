"use strict";

import express from "express";
import { validate } from "../controllers/wordController.js";
import { generate } from "../controllers/masterWordController.js";

/**
 * Word router. Mounted at `/api/words` in the main app.
 *
 * Routes:
 * - `POST /validate` — check whether a submitted word is valid against the
 *   current master word and award the score. Public (game state is the gate).
 * - `GET  /master` — return a new master word. Public.
 *
 * @type {import("express").Router}
 */
const router = express.Router();

router.post("/validate", validate);
router.get("/master", generate);

export default router;
