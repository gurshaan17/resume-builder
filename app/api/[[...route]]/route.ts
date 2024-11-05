import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import documentRoute from "./document";

export const runtime = "edge";

const app = new Hono();

app.use("*", logger());

app.onError((err, c) => {
  console.error('Error:', err);
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json(
    { 
      success: false, 
      message: "Internal server error",
      error: err.message 
    }, 
    500
  );
});

const routes = app.basePath("/api").route("/document", documentRoute);

app.get("/", (c) => {
  return c.json({
    message: "Hello from Ai Resume!",
  });
});

export type AppType = typeof routes;

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
