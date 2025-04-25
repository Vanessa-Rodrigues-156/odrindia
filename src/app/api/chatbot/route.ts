import { Client } from "@gradio/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const client = await Client.connect("AnjaliSingh24/model");
    const result = await client.predict("/chat", {
      message,
      system_message: "You are a ODR assistant. You help users with their queries related to online dispute resolution.",
      max_tokens: 50,
      temperature: 0.7,
      top_p: 0.9,
    });

    return NextResponse.json({ response: result.data });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    return NextResponse.json({ error: "Failed to process the request" }, { status: 500 });
  }
}
