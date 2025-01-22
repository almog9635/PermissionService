import * as jose from "npm:jose";
import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } from "./properties.ts";

export class BlacklistService{

    private static accessTokenBlacklist = new Set<string>();
    private static refreshTokenBlacklist = new Set<string>();
    
    public static blacklistAccessToken(token: string) {
      this.accessTokenBlacklist.add(token);
      this.removeExpiredTokens();
    }
    public static blacklistRefreshToken(token: string) {
      this.refreshTokenBlacklist.add(token);
      this.removeExpiredTokens();
    }

    public static isBlacklistedAccessToken(token: string): boolean {
        return this.accessTokenBlacklist.has(token);
    }

    public static isBlacklistedRefreshToken(token: string): boolean {
        return this.refreshTokenBlacklist.has(token);
    }

    private static async removeExpiredTokens(){
        // millisecond to second casting
        const now = Date.now() / 1000;
        for (const token of this.accessTokenBlacklist) {
          try {
            const { payload } = await jose.jwtVerify(token, ACCESS_SECRET_KEY);
            if (payload.exp && payload.exp < now) this.accessTokenBlacklist.delete(token);
          } catch {
            this.accessTokenBlacklist.delete(token);
          }
        }
        for (const token of this.refreshTokenBlacklist) {
          try {
            const { payload } = await jose.jwtVerify(token, REFRESH_SECRET_KEY);
            if (payload.exp && payload.exp < now) this.refreshTokenBlacklist.delete(token);
          } catch {
            this.refreshTokenBlacklist.delete(token);
          }
        }
      }
}