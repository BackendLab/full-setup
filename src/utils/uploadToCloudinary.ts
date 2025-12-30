// What I need to do -
// write async function to add all the images and files to cloudinary
// add file system to handle the upload and removing the unnecessary file

import cloudinary from "../config/cloudinary";
import fs from "fs";

export const uploadToCloudinary = async (localFilePath: string) => {
  try {
    // checking if the local file path exists or not
    if (!localFilePath) return null;
    // adding file to cloudinary
    const result = cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // removing file from the local storage
    fs.unlinkSync(localFilePath);
    // returning the result
    return result;
  } catch (error) {
    // if the uploading fails then also remove the file from storage
    fs.unlinkSync(localFilePath);
    // logging error
    console.error(error);
    return null;
  }
};
