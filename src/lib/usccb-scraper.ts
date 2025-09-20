/**
 * USCCB Scraper for Catholic Missal
 * Fetches daily liturgical readings from the official USCCB website
 */

import { DailyReadings, LiturgicalReading, LiturgicalError } from './types';

/**
 * Convert date to USCCB URL format (MMDDYY.cfm)
 */
function formatUSCCBDate(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${month}${day}${year}.cfm`;
}

/**
 * Extract reading content from HTML
 */
function extractReading(html: string, sectionTitle: string): LiturgicalReading | null {
  try {
    // Find the section with the given title
    const sectionRegex = new RegExp(`<h3[^>]*>${sectionTitle}[\\s\\S]*?(?=<h3|$)`, 'i');
    const sectionMatch = html.match(sectionRegex);

    if (!sectionMatch) {
      console.warn(`Section "${sectionTitle}" not found`);
      return null;
    }

    const section = sectionMatch[0];

    // Extract citation - look for links to bible verses
    const citationRegex = /<a[^>]+href="[^"]*bible[^"]*"[^>]*>([^<]+)<\/a>/i;
    const citationMatch = section.match(citationRegex);
    const citation = citationMatch ? citationMatch[1].trim() : 'Citation not found';

    // Extract the main text content, removing HTML tags
    let text = section
      .replace(/<h3[^>]*>[^<]*<\/h3>/gi, '') // Remove heading
      .replace(/<a[^>]*>[^<]*<\/a>/gi, '') // Remove links
      .replace(/<[^>]+>/g, '') // Remove all HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
      .replace(/&amp;/g, '&') // Replace HTML entities
      .replace(/&quot;/g, '"')
      .replace(/&#8217;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .trim();

    // Clean up extra whitespace
    text = text.replace(/\s+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim();

    // For psalms, extract the response/refrain
    let response: string | undefined;
    if (sectionTitle.toLowerCase().includes('psalm')) {
      const responseRegex = /R\.\s*([^R\n]+?)(?=\n|$)/i;
      const responseMatch = text.match(responseRegex);
      if (responseMatch) {
        response = responseMatch[1].trim();
      }
    }

    if (!text || text.length < 10) {
      console.warn(`No substantial text found for ${sectionTitle}`);
      return null;
    }

    return {
      title: sectionTitle,
      citation,
      text,
      response,
    };
  } catch (error) {
    console.error(`Error extracting ${sectionTitle}:`, error);
    return null;
  }
}

/**
 * Extract liturgical information from the page
 */
function extractLiturgicalInfo(html: string, date: string): {
  liturgicalDate: string;
  season: string;
  color: DailyReadings['color'];
  rank: DailyReadings['rank'];
  saint?: string;
} {
  try {
    // Extract memorial/feast day information
    const titleRegex = /<title[^>]*>([^<]+)<\/title>/i;
    const titleMatch = html.match(titleRegex);
    let liturgicalDate = titleMatch ? titleMatch[1].trim() : 'Weekday';

    // Clean up the title
    liturgicalDate = liturgicalDate
      .replace(/USCCB.*$/i, '')
      .replace(/Daily Readings.*$/i, '')
      .replace(/\s*-\s*$/, '')
      .trim();

    // Extract saint information
    let saint: string | undefined;
    if (liturgicalDate.toLowerCase().includes('memorial') ||
        liturgicalDate.toLowerCase().includes('feast') ||
        liturgicalDate.toLowerCase().includes('saint')) {
      const saintRegex = /(?:memorial|feast).*?(?:of\s+)?(?:saint\s+)?([^,]+)/i;
      const saintMatch = liturgicalDate.match(saintRegex);
      if (saintMatch) {
        saint = saintMatch[1].trim();
      }
    }

    // Determine liturgical season (basic logic - could be enhanced)
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    let season: string = 'Ordinary Time';
    let color: DailyReadings['color'] = 'green';
    let rank: DailyReadings['rank'] = 'weekday';

    // Basic season detection (simplified)
    if (month === 12 && day >= 17) {
      season = 'Advent';
      color = 'purple';
    } else if (month === 12 && day >= 25) {
      season = 'Christmas';
      color = 'white';
    } else if (month === 1 && day <= 13) {
      season = 'Christmas';
      color = 'white';
    }

    // Memorial/feast day detection
    if (liturgicalDate.toLowerCase().includes('solemnity')) {
      rank = 'solemnity';
      color = 'white';
    } else if (liturgicalDate.toLowerCase().includes('feast')) {
      rank = 'feast';
      color = 'white';
    } else if (liturgicalDate.toLowerCase().includes('memorial')) {
      rank = 'memorial';
      color = 'red'; // Often red for martyrs
    }

    return {
      liturgicalDate,
      season,
      color,
      rank,
      saint,
    };
  } catch (error) {
    console.error('Error extracting liturgical info:', error);
    return {
      liturgicalDate: 'Weekday',
      season: 'Ordinary Time',
      color: 'green',
      rank: 'weekday',
    };
  }
}

/**
 * Scrape readings from USCCB website
 */
export async function scrapeUSCCBReadings(date: string): Promise<DailyReadings | LiturgicalError> {
  try {
    const dateObj = new Date(date);
    const usccbDate = formatUSCCBDate(dateObj);
    const url = `https://bible.usccb.org/bible/readings/${usccbDate}`;

    console.log(`Fetching USCCB readings from: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Extract liturgical information
    const liturgicalInfo = extractLiturgicalInfo(html, date);

    // Extract readings
    const firstReading = extractReading(html, 'Reading I');
    const psalm = extractReading(html, 'Responsorial Psalm');
    const secondReading = extractReading(html, 'Reading II'); // May be null
    const gospel = extractReading(html, 'Gospel');

    // Validate required readings
    if (!firstReading || !psalm || !gospel) {
      throw new Error('Missing required readings from USCCB page');
    }

    const readings: DailyReadings = {
      date,
      liturgicalDate: liturgicalInfo.liturgicalDate,
      season: liturgicalInfo.season,
      color: liturgicalInfo.color,
      rank: liturgicalInfo.rank,
      firstReading,
      psalm,
      secondReading: secondReading || undefined,
      gospel,
      saint: liturgicalInfo.saint,
    };

    console.log(`Successfully scraped readings for ${date}`);
    return readings;

  } catch (error) {
    console.error('Error scraping USCCB readings:', error);

    // Return error with fallback
    return {
      error: `Failed to fetch readings from USCCB: ${error instanceof Error ? error.message : 'Unknown error'}`,
      fallback: {
        date,
        liturgicalDate: 'Unable to fetch liturgical information',
        season: 'Ordinary Time',
        color: 'green',
        rank: 'weekday',
        firstReading: {
          title: 'First Reading',
          citation: 'Unable to fetch',
          text: 'Readings are currently unavailable. Please check the USCCB website directly at bible.usccb.org.',
        },
        psalm: {
          title: 'Responsorial Psalm',
          citation: 'Unable to fetch',
          text: 'Psalm is currently unavailable.',
          response: 'Lord, hear our prayer.',
        },
        gospel: {
          title: 'Gospel',
          citation: 'Unable to fetch',
          text: 'Gospel reading is currently unavailable.',
        },
      },
    };
  }
}

/**
 * Get readings with caching (wrapper around scraper)
 */
export async function getCachedUSCCBReadings(date: string): Promise<DailyReadings | LiturgicalError> {
  const { readingsCache, getReadingsCacheKey } = await import('./cache');
  const cacheKey = getReadingsCacheKey(date);

  // Check cache first
  const cached = readingsCache.get<DailyReadings | LiturgicalError>(cacheKey);
  if (cached) {
    console.log(`Using cached readings for ${date}`);
    return cached;
  }

  // Fetch fresh readings
  const readings = await scrapeUSCCBReadings(date);

  // Cache the result (errors cached for shorter time)
  const ttl = 'error' in readings ?
    30 * 60 * 1000 : // Cache errors for 30 minutes only
    24 * 60 * 60 * 1000; // Cache successful readings for 24 hours

  readingsCache.set(cacheKey, readings, ttl);

  return readings;
}