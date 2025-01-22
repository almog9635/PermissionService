import { Context } from "@oak/oak";
import { logger } from "../consts.ts";

export async function requestLogger(ctx: Context, next: () => Promise<unknown>) {
  logger.info(`HTTP ${ctx.request.method} on ${ctx.request.url}`);
  await next();
}