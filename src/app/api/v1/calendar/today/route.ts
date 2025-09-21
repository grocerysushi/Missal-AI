/**
 * Calendar API - Today's liturgical information
 * GET /api/v1/calendar/today
 */

import { NextResponse } from 'next/server';
import { CalendarResponse } from '@/lib/api-types';
import { getAPILiturgicalDay } from '@/lib/liturgical-calendar';
import { getSourceAttribution } from '@/lib/api-converters';

export async function GET() {
  try {
    const today = new Date();
    const liturgicalDay = getAPILiturgicalDay(today);

    const response: CalendarResponse = {
      success: true,
      liturgical_day: liturgicalDay,
      source_attribution: getSourceAttribution()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting today\'s calendar:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve liturgical calendar information',
      detail: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge';