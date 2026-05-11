"use strict";

import express from "express";
import { validate } from "../controllers/wordController.js";
import { generate } from "../controllers/masterWordController.js";

const router = express.Router();

router.post("/validate", validate);
router.get("/master", generate);

export default router;
