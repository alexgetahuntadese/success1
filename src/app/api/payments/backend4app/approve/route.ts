import { NextRequest, NextResponse } from "next/server";

import { getSubmission, mapParseSubmission, updateSubmission } from "../../_lib";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, adminNotes } = body ?? {};

    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId." }, { status: 400 });
    }

    const existing = await getSubmission(paymentId);
    await updateSubmission(paymentId, {
      status: "backend4app_approved",
      reviewerNotes: adminNotes || null,
      verifiedAt: new Date().toISOString(),
    });

    const updated = await getSubmission(paymentId);
    return NextResponse.json(mapParseSubmission(updated));
  } catch (error) {
    console.error("Back4App payment approve error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to approve payment." },
      { status: 500 }
    );
  }
}
