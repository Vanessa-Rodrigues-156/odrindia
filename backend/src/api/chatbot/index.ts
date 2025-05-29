import express, { Request, Response } from "express";
import axios from "axios";
const router = express.Router();
router.post("/", async (req: Request, res: Response) => {
  console.log("[Chatbot] Received request");
  try {
    const { message } = req.body;
    console.log("[Chatbot] Request body:", req.body);
    if (!message) {
      console.warn("[Chatbot] No message provided");
      return res.status(400).json({ error: "Message is required" });
    }
    // Use dynamic import for ESM-only @gradio/client
    console.log("[Chatbot] Importing @gradio/client...");
    const { Client } = await import("@gradio/client");
    console.log("[Chatbot] Connecting to model...");
    const client = await Client.connect("hysts/mistral-7b");
    console.log("[Chatbot] Connected. Sending predict request...");
    // Timeout wrapper
    const result = await Promise.race([
      client.predict("/chat", {
        message: message,
        param_2: 1024,
        param_3: 0.6,
        param_4: 0.9,
        param_5: 50,
        param_6: 1.2,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Model timed out")), 30000)
      ),
    ]) as { data: any };
    console.log("[Chatbot] Model response:", result.data);
    return res.json({ response: result.data });
  } catch (error: unknown) {
    console.error("[Chatbot] Error in chatbot API:", error);
    let msg = "Failed to process the request";
    if (error instanceof Error && error.message.includes("timed out")) {
      msg = "The language model took too long to respond. Please try again.";
    }
    return res.status(500).json({ error: msg });
  }
});
router.post("/test", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    // Test: echo the message and simulate a successful response
    return res.json({ response: `Echo: ${message}` });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Chatbot test error:", msg);
    return res.status(500).json({ error: msg });
  }
});

export default router;

