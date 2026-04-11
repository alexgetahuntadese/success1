import { NextRequest, NextResponse } from "next/server";

import { createSubmission, mapParseSubmission, uploadReceiptToBack4App } from "../_lib";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      userName,
      userPhone,
      amount,
      bankName,
      accountNumber,
      transactionRef,
      paymentMethod,
      submitterNotes,
      receiptBase64,
      receiptFileName,
      receiptContentType,
    } = body ?? {};

    if (!userId || !amount || !bankName || !accountNumber || !transactionRef || !paymentMethod) {
      return NextResponse.json({ error: "Missing required payment fields." }, { status: 400 });
    }

    let receipt = null;
    if (receiptBase64 && receiptFileName) {
      receipt = await uploadReceiptToBack4App(
        receiptFileName,
        receiptContentType || "image/jpeg",
        receiptBase64
      );
    }

    const created = await createSubmission({
      userId,
      userName: userName || null,
      userPhone: userPhone || null,
      amount: Number(amount),
      bankName,
      accountNumber,
      transactionRef,
      paymentMethod,
      status: "pending",
      receiptPath: receipt?.name || null,
      receiptUrl: receipt?.url || null,
      receiptContentType: receiptContentType || null,
      receiptSizeBytes: receiptBase64 ? receiptBase64.length : null,
      submittedAt: new Date().toISOString(),
      reviewerNotes: null,
      submitterNotes: submitterNotes || null,
      verifiedAt: null,
      verifiedBy: null,
    });

    return NextResponse.json(
      mapParseSubmission({
        objectId: created.objectId,
        createdAt: created.createdAt,
        updatedAt: created.createdAt,
        userId,
        userName: userName || null,
        userPhone: userPhone || null,
        amount: Number(amount),
        bankName,
        accountNumber,
        transactionRef,
        paymentMethod,
        status: "pending",
        receiptPath: receipt?.name || null,
        receiptUrl: receipt?.url || null,
        receiptContentType: receiptContentType || null,
        receiptSizeBytes: receiptBase64 ? receiptBase64.length : null,
        submittedAt: new Date().toISOString(),
        reviewerNotes: null,
        submitterNotes: submitterNotes || null,
        verifiedAt: null,
        verifiedBy: null,
      })
    );
  } catch (error) {
    console.error("Back4App payment submit error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment submission failed." },
      { status: 500 }
    );
  }
}
