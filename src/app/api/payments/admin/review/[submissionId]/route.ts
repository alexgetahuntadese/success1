import { NextRequest, NextResponse } from "next/server";

import { getSubmission, mapParseSubmission, updateSubmission } from "../../../_lib";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { submissionId } = await params;
    const { status, reviewerNotes } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "status is required." }, { status: 400 });
    }

    await updateSubmission(submissionId, {
      status,
      reviewerNotes: reviewerNotes || null,
      verifiedAt: status === "verified" || status === "approved" ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    });

    const updated = await getSubmission(submissionId);
    return NextResponse.json(mapParseSubmission(updated));
  } catch (error) {
    console.error("Back4App admin review error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not review submission." },
      { status: 500 }
    );
  }
}
