"use strict";

const COOKIE_NAME = "uid";

const COOKIE_OPTIONS = {
  signed: true,
  httpOnly: true,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export function setAuthCookie(res, userId) {
  res.cookie(COOKIE_NAME, userId.toString(), COOKIE_OPTIONS);
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
}

export function readAuthCookie(req) {
  return req.signedCookies[COOKIE_NAME] || null;
}