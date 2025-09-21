/**
 * Calendar API - Specific date liturgical information
 * GET /api/v1/calendar/{date}
 */

import { NextRequest, NextResponse } from 'next/server';
import { CalendarResponse } from '@/lib/api-types';
import { getAPILiturgicalDay } from '@/lib/liturgical-calendar';
import { getSourceAttribution } from '@/lib/api-converters';

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

    const date = new Date(dateStr + 'T12:00:00.000Z'); // Use noon UTC to avoid timezone issues

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return NextResponse.json({
        success: false,
        error: 'Invalid date',
        detail: 'The provided date is not valid'
      }, { status: 400 });
    }

    const liturgicalDay = getAPILiturgicalDay(date);

    const response: CalendarResponse = {
      success: true,
      liturgical_day: liturgicalDay,
      source_attribution: getSourceAttribution()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting calendar for date:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve liturgical calendar information',
      detail: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge';