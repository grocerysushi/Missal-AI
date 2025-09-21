/**
 * Liturgical Calendar Utilities for Catholic Missal
 * Handles calculations for liturgical seasons, feast days, and calendar navigation
 * Enhanced to support Catholic Missal API structure
 */

import { LiturgicalSeason as APILiturgicalSeason, LiturgicalRank, LiturgicalColor, Celebration, LiturgicalDay } from './api-types';

export interface LiturgicalSeason {
  name: 'Advent' | 'Christmas' | 'Ordinary Time' | 'Lent' | 'Easter';
  color: 'red' | 'gold' | 'white' | 'green' | 'purple' | 'rose' | 'black';
  startDate: Date;
  endDate: Date;
}

export interface LiturgicalYear {
  year: number; // Church year (starts with First Sunday of Advent)
  sundayLetterCycle: 'A' | 'B' | 'C';
  weekdayCycle: 'I' | 'II';
  easterDate: Date;
}

/**
 * Calculate Easter date for a given year using the algorithm
 * Based on the Gregorian calendar Easter calculation
 */
export function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

/**
 * Calculate the First Sunday of Advent for a given year
 */
export function getFirstSundayOfAdvent(year: number): Date {
  // First Sunday of Advent is the fourth Sunday before Christmas (Dec 25)
  const christmas = new Date(year, 11, 25); // December 25
  const dayOfWeek = christmas.getDay();

  // Calculate days until the previous Sunday (or Christmas if it's Sunday)
  const daysToSunday = dayOfWeek === 0 ? 0 : dayOfWeek;

  // Go back to the 4th Sunday before
  const fourthSundayBefore = new Date(christmas);
  fourthSundayBefore.setDate(christmas.getDate() - daysToSunday - 21); // 3 weeks back

  return fourthSundayBefore;
}

/**
 * Determine the liturgical year cycle for a given date
 */
export function getLiturgicalYear(date: Date): LiturgicalYear {
  const year = date.getFullYear();
  const firstSundayOfAdvent = getFirstSundayOfAdvent(year);

  let liturgicalYear: number;

  // If we're before the First Sunday of Advent, we're still in the previous liturgical year
  if (date < firstSundayOfAdvent) {
    liturgicalYear = year;
  } else {
    liturgicalYear = year + 1;
  }

  const easterDate = calculateEaster(liturgicalYear);

  // Sunday letter cycle: A, B, C (repeats every 3 years)
  // Year A begins in years divisible by 3
  const sundayLetterCycle: 'A' | 'B' | 'C' =
    liturgicalYear % 3 === 0 ? 'A' :
    liturgicalYear % 3 === 1 ? 'B' : 'C';

  // Weekday cycle: I, II (alternates every year)
  const weekdayCycle: 'I' | 'II' = liturgicalYear % 2 === 1 ? 'I' : 'II';

  return {
    year: liturgicalYear,
    sundayLetterCycle,
    weekdayCycle,
    easterDate,
  };
}

/**
 * Determine the liturgical season for a given date
 */
export function getLiturgicalSeason(date: Date): LiturgicalSeason {
  const year = date.getFullYear();
  const liturgicalYear = getLiturgicalYear(date);
  const easter = liturgicalYear.easterDate;

  // Calculate key dates
  const firstSundayOfAdvent = getFirstSundayOfAdvent(year);
  const christmas = new Date(year, 11, 25);
  const baptismOfTheLord = getBaptismOfTheLord(year);
  const ashWednesday = new Date(easter);
  ashWednesday.setDate(easter.getDate() - 46);
  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 49);

  // Determine the season
  if (date >= firstSundayOfAdvent && date < christmas) {
    return {
      name: 'Advent',
      color: 'purple',
      startDate: firstSundayOfAdvent,
      endDate: new Date(christmas.getTime() - 1),
    };
  }

  if (date >= christmas && date <= baptismOfTheLord) {
    return {
      name: 'Christmas',
      color: 'white',
      startDate: christmas,
      endDate: baptismOfTheLord,
    };
  }

  if (date >= ashWednesday && date < easter) {
    return {
      name: 'Lent',
      color: 'purple',
      startDate: ashWednesday,
      endDate: new Date(easter.getTime() - 1),
    };
  }

  if (date >= easter && date <= pentecost) {
    return {
      name: 'Easter',
      color: 'white',
      startDate: easter,
      endDate: pentecost,
    };
  }

  // Default to Ordinary Time
  const ordinaryTimeStart = date > pentecost ?
    new Date(pentecost.getTime() + 86400000) : // Day after Pentecost
    new Date(baptismOfTheLord.getTime() + 86400000); // Day after Baptism of the Lord

  const ordinaryTimeEnd = date > pentecost ?
    new Date(firstSundayOfAdvent.getTime() - 1) : // Day before First Sunday of Advent
    new Date(ashWednesday.getTime() - 1); // Day before Ash Wednesday

  return {
    name: 'Ordinary Time',
    color: 'green',
    startDate: ordinaryTimeStart,
    endDate: ordinaryTimeEnd,
  };
}

/**
 * Calculate the Baptism of the Lord (ends Christmas season)
 * Usually the Sunday after January 6, but if Jan 6 is Sunday, then Jan 7
 */
function getBaptismOfTheLord(year: number): Date {
  const epiphany = new Date(year, 0, 6); // January 6
  const dayOfWeek = epiphany.getDay();

  if (dayOfWeek === 0) {
    // If Epiphany is Sunday, Baptism is the next day (Monday)
    return new Date(year, 0, 7);
  } else {
    // Next Sunday after Epiphany
    const daysUntilSunday = 7 - dayOfWeek;
    return new Date(year, 0, 6 + daysUntilSunday);
  }
}

/**
 * Check if a date is a Sunday
 */
export function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

/**
 * Get the next Sunday from a given date
 */
export function getNextSunday(date: Date): Date {
  const nextSunday = new Date(date);
  const daysUntilSunday = (7 - date.getDay()) % 7;
  nextSunday.setDate(date.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
  return nextSunday;
}

/**
 * Get the previous Sunday from a given date
 */
export function getPreviousSunday(date: Date): Date {
  const previousSunday = new Date(date);
  const daysSinceSunday = date.getDay();
  previousSunday.setDate(date.getDate() - (daysSinceSunday === 0 ? 7 : daysSinceSunday));
  return previousSunday;
}

/**
 * Format liturgical date string for display
 */
export function formatLiturgicalDateString(date: Date): string {
  const season = getLiturgicalSeason(date);
  const liturgicalYear = getLiturgicalYear(date);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formattedDate = date.toLocaleDateString('en-US', options);

  return `${formattedDate} • ${season.name} • Year ${liturgicalYear.sundayLetterCycle}`;
}

/**
 * Get an array of dates for calendar navigation
 */
export function getCalendarDates(year: number, month: number): Date[] {
  const dates: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Add previous month's trailing days
  const startPadding = firstDay.getDay();
  for (let i = startPadding - 1; i >= 0; i--) {
    const date = new Date(firstDay);
    date.setDate(date.getDate() - i - 1);
    dates.push(date);
  }

  // Add current month's days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    dates.push(new Date(year, month, day));
  }

  // Add next month's leading days to complete the week
  const endPadding = 6 - lastDay.getDay();
  for (let i = 1; i <= endPadding; i++) {
    const date = new Date(lastDay);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  return dates;
}

// Enhanced API-compatible functions

/**
 * Get celebrations for a specific date (API compatible)
 */
export function getCelebrations(date: Date): Celebration[] {
  const celebrations: Celebration[] = [];
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Major fixed celebrations
  const fixedCelebrations: Record<string, Omit<Celebration, 'proper_readings'>> = {
    '1-1': { name: 'Mary, the Holy Mother of God', rank: 'Solemnity', color: 'White', description: 'Solemnity of Mary, Mother of God' },
    '1-6': { name: 'The Epiphany of the Lord', rank: 'Solemnity', color: 'White', description: 'The manifestation of Christ to the Gentiles' },
    '2-2': { name: 'The Presentation of the Lord', rank: 'Feast', color: 'White', description: 'Candlemas' },
    '3-19': { name: 'Saint Joseph, Spouse of the Blessed Virgin Mary', rank: 'Solemnity', color: 'White' },
    '3-25': { name: 'The Annunciation of the Lord', rank: 'Solemnity', color: 'White' },
    '6-24': { name: 'The Nativity of Saint John the Baptist', rank: 'Solemnity', color: 'White' },
    '6-29': { name: 'Saints Peter and Paul, Apostles', rank: 'Solemnity', color: 'Red' },
    '8-15': { name: 'The Assumption of the Blessed Virgin Mary', rank: 'Solemnity', color: 'White' },
    '9-21': { name: 'Saint Matthew, Apostle and Evangelist', rank: 'Feast', color: 'Red' },
    '11-1': { name: 'All Saints', rank: 'Solemnity', color: 'White' },
    '11-2': { name: 'The Commemoration of All the Faithful Departed', rank: 'Memorial', color: 'Purple' },
    '12-8': { name: 'The Immaculate Conception of the Blessed Virgin Mary', rank: 'Solemnity', color: 'White' },
    '12-25': { name: 'The Nativity of the Lord', rank: 'Solemnity', color: 'White', description: 'Christmas Day' }
  };

  const key = `${month}-${day}`;
  if (fixedCelebrations[key]) {
    celebrations.push({
      ...fixedCelebrations[key],
      proper_readings: ['Solemnity', 'Feast'].includes(fixedCelebrations[key].rank)
    });
  }

  return celebrations;
}

/**
 * Convert internal liturgical season to API format
 */
export function getAPILiturgicalSeason(date: Date): {
  season: APILiturgicalSeason;
  week?: number;
  color: LiturgicalColor;
} {
  const season = getLiturgicalSeason(date);

  // Convert color to API format
  const colorMap: Record<string, LiturgicalColor> = {
    'red': 'Red',
    'gold': 'White',
    'white': 'White',
    'green': 'Green',
    'purple': 'Purple',
    'rose': 'Rose',
    'black': 'Black'
  };

  return {
    season: season.name as APILiturgicalSeason,
    color: colorMap[season.color] || 'Green'
  };
}

/**
 * Get complete liturgical day information (API compatible)
 */
export function getAPILiturgicalDay(date: Date): Omit<LiturgicalDay, 'readings'> {
  const seasonInfo = getAPILiturgicalSeason(date);
  const celebrations = getCelebrations(date);
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Determine primary celebration and color
  let primaryCelebration: Celebration | undefined;
  let dayColor = seasonInfo.color;

  if (celebrations.length > 0) {
    // Sort by rank priority (Solemnity > Feast > Memorial > Optional Memorial)
    const rankPriority = { 'Solemnity': 4, 'Feast': 3, 'Memorial': 2, 'Optional Memorial': 1, 'Weekday': 0, 'Sunday': 0 };
    celebrations.sort((a, b) => rankPriority[b.rank] - rankPriority[a.rank]);
    primaryCelebration = celebrations[0];

    // High-ranking celebrations override seasonal color
    if (['Solemnity', 'Feast'].includes(primaryCelebration.rank)) {
      dayColor = primaryCelebration.color;
    }
  }

  return {
    date: date.toISOString().split('T')[0],
    season: seasonInfo.season,
    season_week: seasonInfo.week,
    weekday: weekdays[date.getDay()],
    celebrations,
    primary_celebration: primaryCelebration,
    color: dayColor,
    source: 'Internal liturgical calendar calculations',
    last_updated: new Date().toISOString()
  };
}

/**
 * Convert liturgical color to CSS-compatible color used in the app
 */
export function getColorForApp(liturgicalColor: LiturgicalColor): 'red' | 'gold' | 'white' | 'green' | 'purple' | 'rose' | 'black' {
  const colorMap: Record<LiturgicalColor, 'red' | 'gold' | 'white' | 'green' | 'purple' | 'rose' | 'black'> = {
    'Red': 'red',
    'White': 'gold', // Using gold for white since it's more visually appealing
    'Green': 'green',
    'Purple': 'purple',
    'Rose': 'rose',
    'Black': 'black'
  };

  return colorMap[liturgicalColor];
}