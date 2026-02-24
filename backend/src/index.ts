import dotenv from "dotenv";
import path from "path";
import express from "express";

// Load .env from root or current directory
dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });
dotenv.config();

import apiRoutes from "./routes/api.js";

const startServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API Routes
  app.use("/api", apiRoutes);

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    const rootDir = path.resolve();
    // Check if we're running from root or backend folder
    const frontendDist = rootDir.endsWith("backend")
      ? path.join(rootDir, "../frontend/dist")
      : path.join(rootDir, "frontend/dist");

    app.use(express.static(frontendDist));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(frontendDist, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch(console.error);
