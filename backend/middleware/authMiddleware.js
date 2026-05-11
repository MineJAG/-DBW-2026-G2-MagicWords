"use strict";

import { getAuthUserId } from "../controllers/cookieController.js";

export function requireAuth(req, res, next) {
  const userId = getAuthUserId(req);
  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  req.userId = userId;
  next();
}
