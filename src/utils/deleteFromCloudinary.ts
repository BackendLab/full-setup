// import cloudinary from "../config/cloudinary";

// // Steps -
// // 1. Receive the publicId as param
// // 2. Validate if the publicId exists or not, if not exist
// // 3. Call cloudinary delete API
// // 4. Check if the cloudinary response, if it's send "ok" return true, if "not found" or "error" log the error
// // 5. Return the status

// export const deleteFromCloudinary = async (
//   publicId: string
// ): Promise<boolean> => {
//   // check if publicId exist or not
//   if (!publicId) return true;

//   try {
//     // call cloudinary
//     // NOTE: Variable name must be result, if not then typescript will throw error
//     const result = await cloudinary.uploader.destroy(publicId);

//     // check if result is ok or not
//     if (result.result !== "ok") {
//       console.error("Cloudinary deletion failed!", result);
//       return false;
//     }
//     // check if the result is "not found" then log the error
//     if (result.result === "not found") {
//       console.error("Image not found!", result);
//       return false;
//     }

//     // if deletion successfull
//     return true;
//   } catch (error) {
//     console.error("Cloudinary delete error", error);
//     return false;
//   }
// };

// ----------------------------------------------------

// Steps -
// 1. Receive the publicId as param
// 2. Validate if the publicId exists or not, if not exist
// 3. Call cloudinary delete API
// 4. Check if the cloudinary response, if it's send "ok" return true, if "not found" or "error" log the error
// 5. Return the status
import cloudinary from "../config/cloudinary";

export const deleteFromCloudinary = async (
  publicId: string
): Promise<boolean> => {
  // ckeck if the publicId si missing or not
  if (!publicId) return true; // return true means no publicId exist so image is already deleted

  try {
    // call cloudinary deletion api if image exist
    const deleted = await cloudinary.uploader.destroy(publicId);

    // check if result is "ok"
    if (deleted.result === "ok") return true;

    // if result is "not found" - then already deleted - return true
    if (deleted.result === "not found") {
      console.warn("Image is deleted already!", publicId);
      return true;
    }

    // if there is an error while deleting - return false
    console.error("Cloudinary deletion failed!", deleted.result);
    return false;
  } catch (error) {
    console.error("cloudinary deletion error:", error);
    return false;
  }
};
