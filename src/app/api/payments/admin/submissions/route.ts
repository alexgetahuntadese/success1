import { NextResponse } from "next/server";

import { listSubmissions, mapParseSubmission } from "../../_lib";

export async function GET() {
  try {
    const payload = await listSubmissions();
    return NextResponse.json(payload.results.map(mapParseSubmission));
  } catch (error) {
    console.error("Back4App admin submissions error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load admin submissions." },
      { status: 500 }
    );
  }
}
