import { type Context } from "hono";
import { HTTPException } from "hono/http-exception";

export const handleError = (err: Error, c: Context) => {
  let statusCode: number = 400;

  if (err instanceof HTTPException) {
    statusCode = err.status;
  }

  return c.json(
    {
      success: false,
      error: err,
      message: err.message || "An error occured.",
    },
    statusCode as never
  );
};
