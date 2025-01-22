import { Context } from "@oak/oak";
import { logger } from "../consts.ts";

export async function errorHandler(ctx: Context, next: () => Promise<unknown>) {
  try {
    await next();
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`Error occurred: ${err.message}`);
    } else {
      logger.error("An unknown error occurred");
    }
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
}
