"use strict";

import { AuthCookie } from "../models/cookie.js";

export function issueAuth(res, userId) {
  AuthCookie.set(res, String(userId));
}

export function revokeAuth(res) {
  AuthCookie.clear(res);
}

export function getAuthUserId(req) {
  return AuthCookie.read(req);
}
