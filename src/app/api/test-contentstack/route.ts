import { NextResponse } from 'next/server';
import { debugFetchAll } from '@/lib/contentstack-data';

export async function GET() {
  try {
    const results = await debugFetchAll();
    
    return NextResponse.json({
      success: true,
      message: 'Contentstack debug data',
      data: results,
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
