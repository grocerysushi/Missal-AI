import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types for liturgical readings
export interface LiturgicalReading {
  title: string;
  citation: string;
  text: string;
  response?: string; // For responsorial psalms
}

export interface DailyReadings {
  date: string;
  liturgicalDate: string;
  season: string;
  color: 'red' | 'gold' | 'white' | 'green' | 'purple' | 'rose' | 'black';
  rank: 'solemnity' | 'feast' | 'memorial' | 'optional_memorial' | 'weekday';
  firstReading: LiturgicalReading;
  psalm: LiturgicalReading;
  secondReading?: LiturgicalReading;
  gospel: LiturgicalReading;
  saint?: string;
}

export interface LiturgicalError {
  error: string;
  fallback?: Partial<DailyReadings>;
}

/**
 * Creates a comprehensive prompt for GPT-5 to fetch Catholic Mass readings
 */
function createLiturgicalPrompt(date: string): string {
  return `You are a Catholic liturgical expert. Provide the complete Mass readings for ${date} according to the Roman Catholic liturgical calendar (Ordinary Form/Novus Ordo).

IMPORTANT GUIDELINES:
- Use the official Lectionary readings for the Roman Rite
- Follow the proper liturgical year cycle (Year A, B, or C for Sundays; Year I or II for weekdays)
- Include complete biblical citations (Book Chapter:Verse-Verse)
- Respect liturgical precedence (solemnities override other celebrations)
- Provide actual scripture text, not just citations

Please respond with ONLY a valid JSON object in this exact format:

{
  "date": "${date}",
  "liturgicalDate": "Full liturgical date name (e.g., 'Second Sunday of Advent', 'Memorial of Saint Francis of Assisi')",
  "season": "One of: Advent, Christmas, Ordinary Time, Lent, Easter",
  "color": "One of: red, gold, white, green, purple, rose, black",
  "rank": "One of: solemnity, feast, memorial, optional_memorial, weekday",
  "firstReading": {
    "title": "First Reading title",
    "citation": "Complete citation (e.g., 'Isaiah 2:1-5')",
    "text": "Complete scripture text from the Lectionary"
  },
  "psalm": {
    "title": "Responsorial Psalm title",
    "citation": "Psalm citation (e.g., 'Psalm 122:1-2, 3-4, 4-5, 6-7, 8-9')",
    "text": "Psalm verses as used in the liturgy",
    "response": "Psalm response/antiphon"
  },
  "secondReading": {
    "title": "Second Reading title (omit this entire object if no second reading)",
    "citation": "Complete citation",
    "text": "Complete scripture text"
  },
  "gospel": {
    "title": "Gospel reading title",
    "citation": "Gospel citation (e.g., 'Matthew 24:37-44')",
    "text": "Complete Gospel text"
  },
  "saint": "Name of saint if it's a saint's day (optional)"
}

Ensure theological accuracy and reverence. If uncertain about any reading, indicate this in the response.`;
}

/**
 * Fetches liturgical readings for a specific date using GPT-5
 */
export async function fetchLiturgicalReadings(
  date: string
): Promise<DailyReadings | LiturgicalError> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        error: 'OpenAI API key not configured',
        fallback: {
          date,
          liturgicalDate: 'Unable to fetch liturgical information',
          season: 'Ordinary Time',
          color: 'green',
          rank: 'weekday',
        },
      };
    }

    const prompt = createLiturgicalPrompt(date);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Will update to gpt-5 when available
      messages: [
        {
          role: 'system',
          content: 'You are an expert Catholic liturgist with comprehensive knowledge of the Roman Catholic liturgical calendar and readings. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.1, // Low temperature for consistency and accuracy
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from GPT-5');
    }

    // Parse and validate the JSON response
    const readings: DailyReadings = JSON.parse(response);

    // Basic validation
    if (!readings.firstReading || !readings.psalm || !readings.gospel) {
      throw new Error('Missing required readings');
    }

    return readings;
  } catch (error) {
    console.error('Error fetching liturgical readings:', error);

    // Provide fallback structure
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: {
        date,
        liturgicalDate: 'Unable to determine liturgical date',
        season: 'Ordinary Time',
        color: 'green',
        rank: 'weekday',
        firstReading: {
          title: 'Reading unavailable',
          citation: 'Please check your internet connection',
          text: 'Liturgical readings could not be loaded at this time.',
        },
        psalm: {
          title: 'Responsorial Psalm unavailable',
          citation: 'Please check your internet connection',
          text: 'Psalm could not be loaded at this time.',
          response: 'Lord, hear our prayer.',
        },
        gospel: {
          title: 'Gospel unavailable',
          citation: 'Please check your internet connection',
          text: 'Gospel reading could not be loaded at this time.',
        },
      },
    };
  }
}

/**
 * Gets readings with caching to avoid unnecessary API calls
 */
export async function getCachedReadings(
  date: string
): Promise<DailyReadings | LiturgicalError> {
  const { readingsCache, getReadingsCacheKey } = await import('@/lib/cache');
  const cacheKey = getReadingsCacheKey(date);

  // Check cache first
  const cached = readingsCache.get<DailyReadings | LiturgicalError>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch fresh readings
  const readings = await fetchLiturgicalReadings(date);

  // Cache the result (both success and error responses, but with different TTLs)
  const ttl = 'error' in readings ?
    30 * 60 * 1000 : // Cache errors for 30 minutes only
    24 * 60 * 60 * 1000; // Cache successful readings for 24 hours

  readingsCache.set(cacheKey, readings, ttl);

  return readings;
}

/**
 * Formats a date for liturgical calendar lookup
 */
export function formatLiturgicalDate(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

/**
 * Gets the liturgical color class for styling
 */
export function getLiturgicalColorClass(color: DailyReadings['color']): string {
  const colorMap = {
    red: 'text-liturgical-red border-liturgical-red',
    gold: 'text-liturgical-gold border-liturgical-gold',
    white: 'text-liturgical-white border-liturgical-white',
    green: 'text-liturgical-green border-liturgical-green',
    purple: 'text-liturgical-purple border-liturgical-purple',
    rose: 'text-liturgical-rose border-liturgical-rose',
    black: 'text-liturgical-black border-liturgical-black',
  };

  return colorMap[color] || 'text-liturgical-green border-liturgical-green';
}