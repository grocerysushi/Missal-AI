/**
 * Readings API - Today's Mass readings
 * GET /api/v1/readings/today
 */

import { NextResponse } from 'next/server';
import { ReadingsResponse } from '@/lib/api-types';
import { getCachedUSCCBReadings } from '@/lib/usccb-scraper';
import { toAPIDailyReadings, getSourceAttribution } from '@/lib/api-converters';

export async function GET() {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

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
    console.error('Error getting today\'s readings:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve daily readings',
      detail: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge';