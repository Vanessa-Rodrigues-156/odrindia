import express from "express";
import cors from "cors";
import authRoutes from "./api/auth";
import ideasRoutes from "./api/ideas";
import meetingsRoutes from "./api/meetings";
import errorHandler from "./middleware/errorHandler";
import { authenticateJWT } from "./middleware/auth";
import odrlabsRoutes from "./api/odrlabs";
import submitIdeaRoutes from "./api/submit-idea";
import discussionRoutes from "./api/discussion";
import adminRoutes from "./api/admin";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideasRoutes);
app.use("/api/meetings", meetingsRoutes);

// Protect ODR Lab and Discussion routes
app.use("/api/odrlabs", authenticateJWT);
app.use("/api/discussion", authenticateJWT, discussionRoutes);

app.use("/api/odrlabs", odrlabsRoutes);
app.use("/api/submit-idea", submitIdeaRoutes);

app.use("/api/admin", authenticateJWT, adminRoutes);

app.use(errorHandler);

export default app;
