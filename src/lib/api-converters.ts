/**
 * API Converters
 * Convert between internal data types and Catholic Missal API formats
 */

import { DailyReadings, LiturgicalReading } from './types';
import { APIDailyReadings, APIReading, APIPsalm, APIPrayer } from './api-types';
import { Prayer } from './prayers-data';
import { getAPILiturgicalDay } from './liturgical-calendar';

/**
 * Convert internal liturgical reading to API reading format
 */
export function toAPIReading(reading: LiturgicalReading, type: 'reading' | 'gospel' = 'reading'): APIReading {
  return {
    reference: reading.citation,
    citation: reading.citation,
    text: reading.text,
    short_text: reading.text.length > 500 ? reading.text.substring(0, 500) + '...' : undefined,
    source: 'USCCB (United States Conference of Catholic Bishops)'
  };
}

/**
 * Convert internal psalm to API psalm format
 */
export function toAPIPsalm(psalm: LiturgicalReading): APIPsalm {
  return {
    reference: psalm.citation,
    citation: psalm.citation,
    text: psalm.text,
    refrain: psalm.response,
    verses: psalm.text.split('\n').filter(line => line.trim() && !line.startsWith('R.')),
    source: 'USCCB (United States Conference of Catholic Bishops)'
  };
}

/**
 * Convert internal daily readings to API daily readings format
 */
export function toAPIDailyReadings(readings: DailyReadings): APIDailyReadings {
  return {
    date: readings.date,
    first_reading: readings.firstReading ? toAPIReading(readings.firstReading) : undefined,
    responsorial_psalm: readings.psalm ? toAPIPsalm(readings.psalm) : undefined,
    second_reading: readings.secondReading ? toAPIReading(readings.secondReading) : undefined,
    gospel_acclamation: undefined, // Not currently extracted from USCCB
    gospel: readings.gospel ? toAPIReading(readings.gospel, 'gospel') : undefined,
    source: 'USCCB (United States Conference of Catholic Bishops)',
    last_updated: new Date().toISOString()
  };
}

/**
 * Convert internal prayer to API prayer format
 */
export function toAPIPrayer(prayer: Prayer): APIPrayer {
  return {
    name: prayer.title,
    category: prayer.category,
    text: prayer.text,
    source: 'USCCB Basic Prayers Collection',
    language: 'en',
    copyright_notice: 'Traditional Catholic prayers from USCCB collection'
  };
}

/**
 * Create liturgical day with readings
 */
export function createLiturgicalDayWithReadings(date: Date, readings: DailyReadings) {
  const liturgicalDay = getAPILiturgicalDay(date);
  const apiReadings = toAPIDailyReadings(readings);

  return {
    ...liturgicalDay,
    readings: apiReadings
  };
}

/**
 * Get source attribution text
 */
export function getSourceAttribution(): string {
  return 'Readings sourced from USCCB (United States Conference of Catholic Bishops) ' +
         'and other official Catholic sources. Liturgical calendar calculations based on ' +
         'official Church documents. Used in accordance with fair use and educational purposes. ' +
         'For commercial use, please ensure proper licensing.';
}

/**
 * Get prayer source attribution
 */
export function getPrayerSourceAttribution(): string {
  return 'Prayers from the USCCB Basic Prayers Collection and traditional Catholic sources. ' +
         'These prayers are part of the Catholic tradition and are used for educational and ' +
         'devotional purposes. Proper attribution is provided for all sources.';
}