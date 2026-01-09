import type { NextFunction, Request } from "express";
import type { AnyZodObject } from "zod/v3";

// What this middleware do is validate the zod schema in the route before sending request to controller
// This function simply parse the upcoming request and check whether the data is correct and expected or not

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
      file: req.file,
    });
    next();
  };
