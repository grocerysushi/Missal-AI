/**
 * Type definitions for Catholic Missal
 */

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