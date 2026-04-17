import { NextRequest, NextResponse } from "next/server";

import { listSubmissions, mapParseSubmission } from "../../payments/_lib";
import { userProfileService } from "@/lib/firebase/auth";
import { setPremiumAccess } from "@/lib/authRoles";

export async function POST(request: NextRequest) {
  try {
    // List all approved submissions
    const response = await listSubmissions({ status: "approved" });
    const submissions = response.results.map(mapParseSubmission);

    let updatedCount = 0;

    for (const submission of submissions) {
      if (!submission.user_id) continue;

      try {
        // Get the user's current profile
        const userProfile = await userProfileService.getUserProfile(submission.user_id);

        if (userProfile) {
          const currentPreferences = userProfile.preferences as any || {};
          const hasPremium = currentPreferences.premium === true;

          if (!hasPremium) {
            // Grant premium access
            const updatedPreferences = setPremiumAccess(currentPreferences, {
              premium: true,
              paymentStatus: "approved",
              paidAt: submission.submitted_at,
              paidUntil: null, // lifetime
              paymentSubmissionId: submission.id,
            });

            // Update the user profile
            await userProfileService.upsertProfile({
              ...userProfile,
              preferences: updatedPreferences,
            });

            updatedCount++;
            console.log(`Granted premium access to user ${submission.user_id} for approved payment ${submission.id}`);
          }
        }
      } catch (error) {
        console.error(`Failed to update premium for user ${submission.user_id}:`, error);
      }
    }

    return NextResponse.json({
      message: `Fixed premium access for ${updatedCount} users out of ${submissions.length} approved submissions.`,
      updatedCount,
      totalApproved: submissions.length,
    });
  } catch (error) {
    console.error("Fix premium error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fix premium access." },
      { status: 500 }
    );
  }
}