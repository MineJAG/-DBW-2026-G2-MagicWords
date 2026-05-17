"use strict";

import { getAuthUserId } from "../controllers/cookieController.js";

/**
 * Express middleware that blocks routes from anyone who isn't logged in.
 * Reads the user id from the auth cookie. If it's missing, responds 401.
 * Otherwise it attaches `req.userId` so the controller can use it.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
export function requireAuth(req, res, next) {
  const userId = getAuthUserId(req);
  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  req.userId = userId;
  next();
}
