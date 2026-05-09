"use strict";

import express from "express";
import { validate } from "../controllers/wordController.js";

const router = express.Router();

router.post("/validate", validate);

export default router;
