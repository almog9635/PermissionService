import { JwtUtil } from "../jwt/jwtUtil.ts";
import { logger } from "../consts.ts";
import { Request as OakRequest } from "@oak/oak";

export async function authGuard(req: OakRequest): Promise<boolean | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return false;
  }

  const token = authHeader.replace("Bearer ", "");
  const isValid = await JwtUtil.verifyAccessToken(token);
  if (!isValid) {
    logger.error("Invalid or blacklisted token");

    return false;
  }

  // If valid, return null, indicating the request may proceed
  return null;
}