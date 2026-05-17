export const AUTH_COOKIE_NAME = "auth";

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  signed: true,
  maxAge: 1000 * 60 * 60 * 24,
};