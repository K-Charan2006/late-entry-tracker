import dotenv from "dotenv";
import path from "path";
import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";

// Load .env from root or current directory
dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });
dotenv.config();

import apiRoutes from "./routes/api.js";

const startServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.json());

  // API Routes
  app.use("/api", apiRoutes);

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    const candidateDirs = [
      path.resolve(process.cwd(), "frontend/dist"),
      path.resolve(process.cwd(), "../frontend/dist"),
      path.resolve(__dirname, "../../frontend/dist"),
    ];
    const frontendDist = candidateDirs.find((dir) => fs.existsSync(path.join(dir, "index.html")));

    if (frontendDist) {
      app.use(express.static(frontendDist));
      app.get("*", (req: any, res: any) => {
        res.sendFile(path.join(frontendDist, "index.html"));
      });
    } else {
      console.error("Frontend build output not found. Checked:", candidateDirs);
      app.get("/", (_req: any, res: any) => {
        res.status(200).send("Backend is running, but frontend/dist is missing. Check Render build command.");
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch(console.error);
