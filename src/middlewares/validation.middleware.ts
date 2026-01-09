import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

// What this middleware do is validate the zod schema in the route before sending request to controller
// This function simply parse the upcoming request and check whether the data is correct and expected or not

export const validate =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
      file: req.file,
    });
    next();
  };
