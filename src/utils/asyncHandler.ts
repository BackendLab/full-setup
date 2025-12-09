import type { Request, Response, NextFunction } from "express";

// Promise based higher order arrow function - production grade way
export const asyncHandler =
  (
    requestHandler: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<any>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };

// Async Await based higher order arrow function - not very used in production grade but its a good way
// export const asyncHandler =
//   (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await fn(req, res, next);
//     } catch (error: any) {
//       res.status(error.statusCode || 500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };
