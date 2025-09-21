/**
 * API Info - General information about the Catholic Missal API
 * GET /api/v1/info
 */

import { NextResponse } from 'next/server';
import { APIInfo } from '@/lib/api-types';

export async function GET() {
  try {
    const apiInfo: APIInfo = {
      name: 'Catholic Missal API',
      version: '1.0.0',
      description: 'Comprehensive API for Catholic liturgical data including daily Mass readings, liturgical calendar information, and traditional prayers.',
      sources: [
        'USCCB (United States Conference of Catholic Bishops)',
        'Vatican Official Sources',
        'Traditional Catholic Prayer Collections',
        'Liturgical Calendar Calculations'
      ],
      endpoints: [
        '/api/v1/info',
        '/api/v1/calendar/today',
        '/api/v1/calendar/{date}',
        '/api/v1/readings/today',
        '/api/v1/readings/{date}',
        '/api/v1/prayers/common',
        '/api/v1/prayers/category/{category}'
      ]
    };

    return NextResponse.json(apiInfo);
  } catch (error) {
    console.error('Error getting API info:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve API information',
      detail: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge';