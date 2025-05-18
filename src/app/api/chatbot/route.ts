import { Client } from "@gradio/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Connect to the Gradio model
    const client = await Client.connect("hysts/mistral-7b");

    // Call the /chat endpoint with parameters similar to your snippet
    const result = await client.predict("/chat", {
      message: message,
      param_2: 1024,
      param_3: 0.6,
      param_4: 0.9,
      param_5: 50,
      param_6: 1.2,
    });

    return NextResponse.json({ response: result.data });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    return NextResponse.json({ error: "Failed to process the request" }, { status: 500 });
  }
}
