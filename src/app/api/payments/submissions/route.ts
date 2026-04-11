import { NextRequest, NextResponse } from "next/server";

import { listSubmissions, mapParseSubmission } from "../_lib";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required." }, { status: 400 });
    }

    const payload = await listSubmissions({
      user: {
        __type: "Pointer",
        className: "_User",
        objectId: userId,
      },
    });
    return NextResponse.json(payload.results.map(mapParseSubmission));
  } catch (error) {
    console.error("Back4App payment list error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load submissions." },
      { status: 500 }
    );
  }
}
