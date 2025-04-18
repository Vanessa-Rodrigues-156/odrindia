import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const attachmentId = searchParams.get("attachmentId");
  console.log("Fetching attachment with ID:", attachmentId); // Log unused variable

  // Return the specified file URL
  return NextResponse.json({
    url: "https://www.indiansmechamber.com/drive/ODR%20Handbook_Revised%20final%20.pdf",
    filename: "ODR_Handbook_Revised_Final.pdf",
    contentType: "application/pdf"
  });
}
