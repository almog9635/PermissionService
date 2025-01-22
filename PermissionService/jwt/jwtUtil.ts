import * as jose from 'npm:jose';
import { User } from '../entity/user.ts';
import {
  ACCESS_SECRET_KEY,
  expirationTime,
  REFRESH_SECRET_KEY,
  refreshExpirationTime,
} from './properties.ts';
import { BlacklistService } from './black-list-service.ts';
import { Role } from "../entity/role.ts";
import { tokens } from "../entity/token.ts";

export class JwtUtil {

  public static async generateTokens(user: User): Promise<tokens> {
    const access = await new jose.SignJWT({
      sub: user.id,
      roles: user.roles.map((role) => role.roleName),
      name : user.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(ACCESS_SECRET_KEY);

    const refresh = await new jose.SignJWT({
      sub: user.id,
      roles: user.roles.map((role) => role.roleName),
      name : user.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(refreshExpirationTime)
      .sign(REFRESH_SECRET_KEY);

    return { access, refresh };
  }

  public static async verifyAccessToken(token: string): Promise<boolean> {
    if (BlacklistService.isBlacklistedAccessToken(token)) return false;
    try {
      const { payload } = await jose.jwtVerify(token, ACCESS_SECRET_KEY);

      return !!payload.sub;
    } catch {

      return false;
    }
  }

  public static async verifyRefreshToken(token: string): Promise<boolean> {
    if (BlacklistService.isBlacklistedRefreshToken(token)) return false;
    try {
      const { payload } = await jose.jwtVerify(token, REFRESH_SECRET_KEY);
      
      return !!payload.sub;
    } catch {

      return false;
    }
  }

  public static async refreshAccessToken(refreshToken: string) {
    const valid = await JwtUtil.verifyRefreshToken(refreshToken);
    if (!valid) return null;

    try {
      const { payload } = await jose.jwtVerify(refreshToken, REFRESH_SECRET_KEY);
      if (!payload.sub) return null;

      const user: User = {
        id: (payload.sub),
        roles: payload.roles as Role[],
        password: "**********",
        name: payload.name as string,
      };

      return JwtUtil.generateTokens(user);
    } catch {
      return null;
    }
  }
}
