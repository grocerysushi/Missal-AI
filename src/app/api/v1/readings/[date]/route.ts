/**
 * Readings API - Specific date Mass readings
 * GET /api/v1/readings/{date}
 */

import { NextRequest, NextResponse } from 'next/server';
import { ReadingsResponse } from '@/lib/api-types';
import { getCachedUSCCBReadings } from '@/lib/usccb-scraper';
import { toAPIDailyReadings, getSourceAttribution } from '@/lib/api-converters';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date: dateStr } = await params;

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid date format',
        detail: 'Date must be in YYYY-MM-DD format (e.g., 2024-12-25)'
      }, { status: 400 });
    }

    const date = new Date(dateStr + 'T12:00:00.000Z');

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return NextResponse.json({
        success: false,
        error: 'Invalid date',
        detail: 'The provided date is not valid'
      }, { status: 400 });
    }

    // Get readings using existing USCCB scraper
    const readingsResult = await getCachedUSCCBReadings(dateStr);

    if ('error' in readingsResult) {
      // Return fallback readings if scraping fails
      const fallbackReadings = toAPIDailyReadings(readingsResult.fallback);

      const response: ReadingsResponse = {
        success: true,
        readings: fallbackReadings,
        source_attribution: getSourceAttribution() + ' (Fallback readings due to source unavailability)'
      };

      return NextResponse.json(response);
    }

    // Convert to API format
    const apiReadings = toAPIDailyReadings(readingsResult);

    const response: ReadingsResponse = {
      success: true,
      readings: apiReadings,
      source_attribution: getSourceAttribution()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting readings for date:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve daily readings',
      detail: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge';