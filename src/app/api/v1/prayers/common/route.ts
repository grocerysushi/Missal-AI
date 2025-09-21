/**
 * Prayers API - Common Catholic prayers
 * GET /api/v1/prayers/common
 */

import { NextResponse } from 'next/server';
import { PrayersResponse } from '@/lib/api-types';
import { BASIC_PRAYERS, getPrayersByCategory } from '@/lib/prayers-data';
import { toAPIPrayer, getPrayerSourceAttribution } from '@/lib/api-converters';

export async function GET() {
  try {
    // Get foundational prayers (most common)
    const foundationalPrayers = getPrayersByCategory('foundational');
    const apiPrayers = foundationalPrayers.map(toAPIPrayer);

    const response: PrayersResponse = {
      success: true,
      prayers: apiPrayers,
      category: 'Common Catholic Prayers',
      source_attribution: getPrayerSourceAttribution()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting common prayers:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve common prayers',
      detail: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge';