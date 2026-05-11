import { AUTH_COOKIE_NAME, authCookieOptions } from "../../config/cookie.js";

export const AuthCookie = {
  set(res, token) {
    res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);
  },

  read(req) {
    return req.signedCookies[AUTH_COOKIE_NAME] || null;
  },

  clear(res) {
    res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions);
  },
};