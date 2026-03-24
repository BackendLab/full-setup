export const generateThumbnails = async (
  publicId: string,
  duration: number
) => {
  // get the cloud name
  const cloudName = Bun.env.CLOUDINARY_CLOUD_NAME;
  // get the timestamps from the video duration
  const timestamps =
    // check if the video duration is less or equal than 5 sec's then tuimestamps would be first 3 sec's
    duration <= 5
      ? [1, 2, 3]
      : [1, Math.floor(duration / 2), Math.max(duration - 2, 1)];
  // NOTE: timestamps is calculated to get the thumbnails from start, middel nad end of the video automaticall, so middle is calculated by divinding the duration, and end is calculated is calculated by subtracting 2 seconds from the duration length or keep 1 second whichever is higher

  // return the api
  return timestamps.map((seconds) => {
    `https://res.cloudinary.com/${cloudName}/video/upload/so_${seconds}/${publicId}.jpg`;
  });
};
