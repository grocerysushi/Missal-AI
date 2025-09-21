/**
 * Prayers API - Prayers by category
 * GET /api/v1/prayers/category/{category}
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrayersResponse } from '@/lib/api-types';
import { getPrayersByCategory, PRAYER_CATEGORIES } from '@/lib/prayers-data';
import { toAPIPrayer, getPrayerSourceAttribution } from '@/lib/api-converters';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    // Validate category exists
    const validCategories = PRAYER_CATEGORIES.map(cat => cat.id);
    if (!validCategories.includes(category)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid category',
        detail: `Category must be one of: ${validCategories.join(', ')}`
      }, { status: 400 });
    }

    // Get prayers for category
    const prayers = getPrayersByCategory(category as any);

    if (prayers.length === 0) {
      return NextResponse.json({
        success: true,
        prayers: [],
        category: PRAYER_CATEGORIES.find(cat => cat.id === category)?.name || category,
        source_attribution: getPrayerSourceAttribution()
      });
    }

    const apiPrayers = prayers.map(toAPIPrayer);
    const categoryInfo = PRAYER_CATEGORIES.find(cat => cat.id === category);

    const response: PrayersResponse = {
      success: true,
      prayers: apiPrayers,
      category: categoryInfo?.name || category,
      source_attribution: getPrayerSourceAttribution()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting prayers by category:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve prayers for category',
      detail: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge';