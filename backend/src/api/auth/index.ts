import { Router } from "express";
import loginHandler from "./login";
import signupHandler from "./signup";
import sessionHandler from "./session";
import logoutHandler from "./logout";
import { authenticateJWT } from "../../middleware/auth";

const router = Router();

router.post("/login", loginHandler);
router.post("/signup", signupHandler);
router.get("/session", authenticateJWT, sessionHandler);
router.post("/logout", logoutHandler); // Optional, for cookie-based JWT

export default router;
