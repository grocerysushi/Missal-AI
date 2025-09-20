import { NextRequest, NextResponse } from 'next/server';
import { getCachedUSCCBReadings } from '@/lib/usccb-scraper';
import { formatLiturgicalDate } from '@/lib/types';

// Enable Edge Runtime for faster responses
export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params;

    // Validate date format
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD.' },
        { status: 400 }
      );
    }

    // Validate that it's a real date
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime()) || formatLiturgicalDate(dateObj) !== date) {
      return NextResponse.json(
        { error: 'Invalid date provided.' },
        { status: 400 }
      );
    }

    // Check if date is too far in the past or future (reasonable liturgical range)
    const now = new Date();
    const minDate = new Date(now.getFullYear() - 2, 0, 1); // 2 years ago
    const maxDate = new Date(now.getFullYear() + 2, 11, 31); // 2 years from now

    if (dateObj < minDate || dateObj > maxDate) {
      return NextResponse.json(
        {
          error: 'Date is outside the available liturgical range.',
          availableRange: {
            start: formatLiturgicalDate(minDate),
            end: formatLiturgicalDate(maxDate),
          },
        },
        { status: 400 }
      );
    }

    // Fetch readings from USCCB
    const readings = await getCachedUSCCBReadings(date);

    // Check if it's an error response
    if ('error' in readings) {
      return NextResponse.json(
        {
          error: readings.error,
          fallback: readings.fallback,
          cached: false,
        },
        { status: 500 }
      );
    }

    // Return successful readings
    return NextResponse.json(
      {
        readings,
        cached: false, // TODO: Implement server-side caching detection
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400', // Cache for 1 hour, stale for 24 hours
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('API route error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error while fetching readings',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}