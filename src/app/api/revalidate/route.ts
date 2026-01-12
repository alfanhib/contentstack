import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Secret key to validate webhook requests
const WEBHOOK_SECRET = process.env.CONTENTSTACK_WEBHOOK_SECRET || 'your-webhook-secret';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (optional but recommended)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      // For development, allow requests without secret
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Parse the Contentstack webhook payload
    const body = await request.json();
    
    // Get the URL of the page that was published/updated
    const pageUrl = body?.data?.url || body?.entry?.url || '/';
    
    // Revalidate the specific page
    revalidatePath(pageUrl);
    
    // Also revalidate home page to update navigation/lists
    if (pageUrl !== '/') {
      revalidatePath('/');
    }
    
    // Revalidate the entire site for new pages
    revalidatePath('/', 'layout');

    return NextResponse.json({
      success: true,
      message: 'Revalidation triggered',
      revalidated: pageUrl,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Also support GET for manual testing
export async function GET() {
  try {
    // Revalidate entire site
    revalidatePath('/', 'layout');
    
    return NextResponse.json({
      success: true,
      message: 'Full site revalidation triggered',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
