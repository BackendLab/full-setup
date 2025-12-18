// NOTE: inside controller only HTTP request logic comes no business logic, no routing, no databse
import { registerUserService } from "../services/auth.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  // get the data from req.body
  const { username, fullName, email, password } = req.body;

  // check if all the fields are available or not
  if (!username || !fullName || !email || !password) {
    throw new ApiError(400, "All feilds are required!");
  }

  // Call the service
  const user = await registerUserService({
    username,
    fullName,
    email,
    password,
  });

  // Controller sends the response
  res
    .status(201)
    .json(new ApiResponse(201, "User Resitered Successfully", user));
});

export default registerUser;
