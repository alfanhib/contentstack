import { NextResponse } from 'next/server';
import { getPersonalizeDebugInfo } from '@/lib/personalize';

/**
 * Debug endpoint to check personalization state
 * GET /api/personalize/debug
 */
export async function GET() {
  const debug = await getPersonalizeDebugInfo();

  return NextResponse.json({
    status: 'ok',
    personalize: {
      userId: debug.userId,
      experiences: debug.experiences,
      manifest: debug.manifest,
    },
    help: {
      message: 'Variants are null because no audience rules matched this user.',
      nextSteps: [
        '1. Go to Contentstack Personalize Dashboard',
        '2. Create an Audience with matching rules (e.g., "All Visitors")',
        '3. In your Experience, assign a variant to that audience',
        '4. Refresh this page - variant should now be active',
      ],
      experienceInfo: debug.experiences.map((exp) => ({
        shortUid: exp.shortUid,
        status: exp.variant ? `Active variant: ${exp.variant}` : 'No variant assigned (needs audience match)',
      })),
    },
  });
}
