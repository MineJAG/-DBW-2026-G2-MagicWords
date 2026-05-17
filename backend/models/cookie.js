import { AUTH_COOKIE_NAME, authCookieOptions } from "../../config/cookie.js";

/**
 * Tiny wrapper around the auth cookie. Keeps the cookie name and options in
 * one place so the rest of the code doesn't have to know about them.
 */
export const AuthCookie = {
  /**
   * Write the auth cookie onto the response.
   *
   * @param {import("express").Response} res
   * @param {string} token - The value to store (the user id).
   * @returns {void}
   */
  set(res, token) {
    res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);
  },

  /**
   * Read the auth cookie from the request. Uses signed cookies, so a
   * tampered value comes back as `null`.
   *
   * @param {import("express").Request} req
   * @returns {string | null}
   */
  read(req) {
    return req.signedCookies[AUTH_COOKIE_NAME] || null;
  },

  /**
   * Remove the auth cookie from the response.
   *
   * @param {import("express").Response} res
   * @returns {void}
   */
  clear(res) {
    res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions);
  },
};