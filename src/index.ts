import { connectDB } from "./db/connect";
import { app } from "./app";

const Port = Bun.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(Port, () => {
      console.log("Server is running on Port:", Port);
    });
  })
  .catch((error) => {
    console.error("Database connection failed!", error);
  });
