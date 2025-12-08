import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${Bun.env.MONGO_URI}/${Bun.env.DB_NAME}`
    );
    console.log(
      "Database connection established successfully!",
      "Host:",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.error("Databse connection failed!", error);
    process.exit(1);
  }
};
