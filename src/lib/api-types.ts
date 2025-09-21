/**
 * Enhanced API types for the Catholic Missal API
 * Compatible with the Catholic Missal API structure while maintaining existing functionality
 */

export type LiturgicalSeason =
  | 'Advent'
  | 'Christmas'
  | 'Ordinary Time'
  | 'Lent'
  | 'Easter Triduum'
  | 'Easter';

export type LiturgicalRank =
  | 'Solemnity'
  | 'Feast'
  | 'Memorial'
  | 'Optional Memorial'
  | 'Weekday'
  | 'Sunday';

export type LiturgicalColor =
  | 'White'
  | 'Red'
  | 'Green'
  | 'Purple'
  | 'Rose'
  | 'Black';

export interface APIReading {
  reference: string;
  citation: string;
  text: string;
  short_text?: string;
  source: string;
}

export interface APIPsalm {
  reference: string;
  citation: string;
  text: string;
  refrain?: string;
  verses?: string[];
  source: string;
}

export interface APIDailyReadings {
  date: string;
  first_reading?: APIReading;
  responsorial_psalm?: APIPsalm;
  second_reading?: APIReading;
  gospel_acclamation?: string;
  gospel?: APIReading;
  source: string;
  last_updated: string;
}

export interface Celebration {
  name: string;
  rank: LiturgicalRank;
  color: LiturgicalColor;
  description?: string;
  proper_readings: boolean;
}

export interface LiturgicalDay {
  date: string;
  season: LiturgicalSeason;
  season_week?: number;
  weekday: string;
  celebrations: Celebration[];
  primary_celebration?: Celebration;
  color: LiturgicalColor;
  readings?: APIDailyReadings;
  source: string;
  last_updated: string;
}

export interface APIPrayer {
  name: string;
  category: string;
  text: string;
  source: string;
  language: string;
  copyright_notice?: string;
}

// Response types
export interface ReadingsResponse {
  success: boolean;
  readings: APIDailyReadings;
  source_attribution: string;
}

export interface CalendarResponse {
  success: boolean;
  liturgical_day: LiturgicalDay;
  source_attribution: string;
}

export interface PrayersResponse {
  success: boolean;
  prayers: APIPrayer[];
  category?: string;
  source_attribution: string;
}

export interface APIInfo {
  name: string;
  version: string;
  description: string;
  sources: string[];
  endpoints: string[];
}

export interface ErrorResponse {
  success: false;
  error: string;
  detail?: string;
}