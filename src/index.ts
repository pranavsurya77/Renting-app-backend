import { app } from "./app";
import { configDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client"

configDotenv()

if(!process.env.PORT || !process.env.DATABASE_URL){
    throw new Error("Missing env variables")
}

const PORT = process.env.PORT

// Remove this line if not used in this file
// const prisma = new PrismaClient()

async function startServer() {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`)
    });

    const handleServerShutdown = async () => {
      try {
        console.log("Shutting down server gracefully...");
        server.close(() => {
          console.log("Server has been shut down.");
          process.exit(0);
        });
      } catch (error) {
        console.error("Error during server shutdown:", error);
        process.exit(1);
      }
    };

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      // Application specific logging, throwing an error, or other logic here
    });

    process.on("SIGINT", handleServerShutdown);
    process.on("SIGTERM", handleServerShutdown);

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();