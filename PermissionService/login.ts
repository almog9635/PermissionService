import { logger } from "./consts.ts";
import { JwtUtil } from "./jwt/jwtUtil.ts";
import { User } from "./entity/user.ts";
import { BlacklistService } from "./jwt/black-list-service.ts";
import { tokens } from "./entity/token.ts";
import { Request as OakRequest } from "@oak/oak";

export async function handleLogin(req: OakRequest): Promise<tokens | undefined> {
    try{
        logger.info(await req.body.json());
        const { userId, password } = await req.body.json();
        logger.info(`User ${userId} login attempt`);
        // when using docker change it to host.docker.internal:
        const response = await fetch("http://host.docker.internal:4001/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId })
        });

        if (!response.ok) {
            logger.error(`Failed to fetch user ${userId} details`);
            
            return;
          }
        const data = await response.json();
        logger.info(`Fetched user ${userId} details:`, data);
        const userRecord = data.users[0] ?? data.users["0"] ?? data;
        const isValid = userRecord.password === `${password}`;
        logger.info(`User ${userId} login attempt: ${isValid ? "success" : "failed"}`);

        if(!isValid) return;

        const user : User = {id: userId, name: userRecord.firstName, password: "", roles: Array.isArray(userRecord.roles) ? userRecord.roles : []};
        const tokens = await JwtUtil.generateTokens(user);

        return tokens;
    } catch (error) {
        logger.error(error);
        return;
    }
    
}

export async function handleRefreshToken(req: OakRequest): Promise<tokens | undefined> {
    const { refreshToken } = await req.body.json();
    const tokens = await JwtUtil.refreshAccessToken(refreshToken);

    if (!tokens) {
        return;
    }

        return tokens;
}

export async function handleLogout(req: OakRequest): Promise<boolean> {
    const { accessToken, refreshToken } = await req.body.json();
    BlacklistService.blacklistAccessToken(accessToken);
    BlacklistService.blacklistRefreshToken(refreshToken);
    return true;
}