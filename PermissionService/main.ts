import { logger } from "./consts.ts";
import { Application, Context, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors"
import { requestLogger } from "./middleware/logger.ts";
import { errorHandler } from "./middleware/error.ts";
import { handleLogin, handleLogout, handleRefreshToken } from "./login.ts";
import { authGuard } from "./middleware/auth.ts";


logger.info("Deno microservice is running on http://localhost:4002");
const router = new Router();
router
  .post("/login", async (ctx: Context) => {
    try {
      const data = await handleLogin(ctx.request);
      if (!data) {

        ctx.response.status = 400;
        ctx.response.body = { error: "Invalid login credentials" };
      } else {

        ctx.response.status = 200;
        ctx.response.body = data;
      }
    } catch (error) {
      logger.error(error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  .post("/refresh-token", async (ctx: Context) => {
    try {
      const data = await handleRefreshToken(ctx.request);
      if (!data) {
        
        ctx.response.status = 400;
        ctx.response.body = { error: "Invalid refresh token" };
      } else {

        ctx.response.status = 200;
        ctx.response.body = data;
      }
    } catch (error) {
      logger.error(error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  .post("/logout", async (ctx: Context) => {
    logger.info("Logout request received");
    try {
      const data = await handleLogout(ctx.request);
      ctx.response.status = 200;
      ctx.response.body = { message: `Logout ${data ? "successful" : "failed"}` };
    } catch (error) {
      logger.error(error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  .post("/verify-token", async (ctx: Context) => {
    logger.info("Token verification request received");
    try{
      const result = await authGuard(ctx.request);
      if (result === false) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Invalid or blacklisted token" };
        return;
      }
      ctx.response.status = 200;
      ctx.response.body = { success: true };
    }catch(error){
      logger.error(error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  })
  .all("(.*)", (ctx: Context) => {
    ctx.response.status = 404;
    ctx.response.body = { error: "Not Found" };
  });

const app = new Application();
app.use(errorHandler)
app.use(requestLogger);
app.use(oakCors({origin: "http://localhost:4000"}));
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 4002 });