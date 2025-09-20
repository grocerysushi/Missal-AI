'use client';

import React from 'react';
import { DailyReadings as DailyReadingsType } from '@/lib/types';
import ReadingDisplay from './ReadingDisplay';
import LiturgicalHeader from './LiturgicalHeader';

interface DailyReadingsProps {
  readings: DailyReadingsType;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export default function DailyReadings({
  readings,
  isLoading = false,
  error,
  className = ''
}: DailyReadingsProps) {
  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`} role="status" aria-label="Loading readings">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-l-4 border-gray-200 pl-6 py-6">
              <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`} role="alert">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 font-medium mb-2">Unable to Load Readings</div>
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // const colorClass = getLiturgicalColorClass(readings.color);

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Liturgical Information Header */}
      <LiturgicalHeader readings={readings} />

      {/* Main Readings Container */}
      <main className="space-y-2" role="main">
        {/* First Reading */}
        <ReadingDisplay
          reading={readings.firstReading}
          type="first"
        />

        {/* Responsorial Psalm */}
        <ReadingDisplay
          reading={readings.psalm}
          type="psalm"
        />

        {/* Second Reading (if present) */}
        {readings.secondReading && (
          <ReadingDisplay
            reading={readings.secondReading}
            type="second"
          />
        )}

        {/* Gospel */}
        <ReadingDisplay
          reading={readings.gospel}
          type="gospel"
        />
      </main>

      {/* Footer with Saint Information */}
      {readings.saint && (
        <footer className="mt-12 pt-6 border-t border-text-muted/20 text-center">
          <div className="bg-cream rounded-lg p-4">
            <h3 className="font-display text-lg text-text-primary mb-2">
              Memorial of
            </h3>
            <p className="text-liturgical-red font-medium">
              {readings.saint}
            </p>
          </div>
        </footer>
      )}

      {/* Print-friendly page break */}
      <div className="page-break-after print:block hidden"></div>
    </div>
  );
}