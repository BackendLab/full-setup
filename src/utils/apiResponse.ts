// ═══════════════════════════════════════════════════════════════════
// ApiResponse Class - Standard Success Response Wrapper for API
// ═══════════════════════════════════════════════════════════════════
// This class creates a consistent response structure for successful API calls.
// It ensures every success response has:
// - statusCode
// - message
// - success flag (always true)
// - data payload
// ═══════════════════════════════════════════════════════════════════

class ApiResponse {
  // ─────────────────────────────────────────────────────────────────
  // PROPERTIES (What a successful response will contain)
  // ─────────────────────────────────────────────────────────────────

  // HTTP status code (200, 201, etc.)
  statusCode: number;

  // Success message (default: "Success")
  message: string;

  // Success flag (always TRUE for successful responses)
  success: boolean;

  // Actual data you want to send to the client
  data: any;

  // ─────────────────────────────────────────────────────────────────
  // CONSTRUCTOR (Runs every time we create a new ApiResponse)
  // ─────────────────────────────────────────────────────────────────
  // Example usage:
  // new ApiResponse(200, "User fetched successfully", user)
  // ─────────────────────────────────────────────────────────────────

  constructor(
    // PARAMETER 1: HTTP status code (REQUIRED)
    // Example: 200 (OK), 201 (Created)
    statusCode: number,

    // PARAMETER 2: Message (OPTIONAL)
    // Default: "Success"
    // Example: "User created", "Fetched successfully"
    message: string = "Success",

    // PARAMETER 3: Data payload (OPTIONAL)
    // Can be object, array, string, anything
    // Example: user object, token, list of products etc.
    data: any
  ) {
    // ───────────────────────────────────────────────────────────────
    // STEP 1: Assign values to class properties
    // ───────────────────────────────────────────────────────────────

    // Set HTTP status code
    this.statusCode = statusCode;

    // Set success message
    this.message = message;

    // Set the response data
    this.data = data;

    // Mark success as TRUE
    // ApiError uses false → ApiResponse uses true
    this.success = true;
  }
}

// ═══════════════════════════════════════════════════════════════════
// EXPORT - Allows this class to be used in other files
// ═══════════════════════════════════════════════════════════════════
// Example usage: import { ApiResponse } from "./ApiResponse";
export { ApiResponse };

// ═══════════════════════════════════════════════════════════════════
// HOW TO USE THIS CLASS
// ═══════════════════════════════════════════════════════════════════
//
// Example 1: Basic success response
// return new ApiResponse(200, "User fetched successfully", user);
//
// Example 2: Create response with default message
// return new ApiResponse(201, undefined, newUser);
//
// Example 3: Send list data
// return new ApiResponse(200, "Products loaded", products);
//
// Example 4: In an Express controller
// res.status(200).json(new ApiResponse(200, "OK", { id: 1 }));
//
// ═══════════════════════════════════════════════════════════════════
//
// WHAT A SUCCESS RESPONSE LOOKS LIKE:
//
// {
//   statusCode: 200,
//   message: "Success",
//   success: true,
//   data: { ... }
// }
//
// ═══════════════════════════════════════════════════════════════════
