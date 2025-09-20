'use client';

import React from 'react';
import { DailyReadings, getLiturgicalColorClass } from '@/lib/gpt5-client';

interface LiturgicalHeaderProps {
  readings: DailyReadings;
  className?: string;
}

export default function LiturgicalHeader({
  readings,
  className = ''
}: LiturgicalHeaderProps) {
  const colorClass = getLiturgicalColorClass(readings.color);

  const getRankDisplay = (rank: string) => {
    switch (rank) {
      case 'solemnity':
        return 'Solemnity';
      case 'feast':
        return 'Feast';
      case 'memorial':
        return 'Memorial';
      case 'optional_memorial':
        return 'Optional Memorial';
      case 'weekday':
        return 'Weekday';
      default:
        return rank;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className={`mb-12 ${className}`}>
      {/* Date Display */}
      <div className="text-center mb-6">
        <time
          dateTime={readings.date}
          className="text-text-secondary text-lg font-medium"
        >
          {formatDate(readings.date)}
        </time>
      </div>

      {/* Liturgical Information */}
      <div
        className={`
          bg-gradient-to-r from-background to-cream
          border-2 ${colorClass}
          rounded-xl p-6 text-center
          shadow-sm
        `}
      >
        <h1 className="font-display text-3xl font-semibold text-text-primary mb-3">
          {readings.liturgicalDate}
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
          {/* Liturgical Season */}
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">Season:</span>
            <span
              className={`
                px-3 py-1 rounded-full font-medium
                ${getLiturgicalColorClass(readings.color)}
                bg-current/10
              `}
            >
              {readings.season}
            </span>
          </div>

          {/* Liturgical Color */}
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">Color:</span>
            <div className="flex items-center gap-2">
              <div
                className={`
                  w-4 h-4 rounded-full border-2 border-white shadow-sm
                  ${readings.color === 'red' ? 'bg-liturgical-red' : ''}
                  ${readings.color === 'gold' ? 'bg-liturgical-gold' : ''}
                  ${readings.color === 'white' ? 'bg-liturgical-white border-gray-300' : ''}
                  ${readings.color === 'green' ? 'bg-liturgical-green' : ''}
                  ${readings.color === 'purple' ? 'bg-liturgical-purple' : ''}
                  ${readings.color === 'rose' ? 'bg-liturgical-rose' : ''}
                  ${readings.color === 'black' ? 'bg-liturgical-black' : ''}
                `}
                aria-label={`Liturgical color: ${readings.color}`}
              />
              <span className="capitalize font-medium text-text-primary">
                {readings.color}
              </span>
            </div>
          </div>

          {/* Liturgical Rank */}
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">Rank:</span>
            <span className="font-medium text-text-primary">
              {getRankDisplay(readings.rank)}
            </span>
          </div>
        </div>

        {/* Special Decorative Elements for High Feasts */}
        {(readings.rank === 'solemnity' || readings.rank === 'feast') && (
          <div className="mt-4 flex justify-center">
            <div className={`flex items-center gap-1 ${colorClass}`}>
              <span className="text-2xl">✠</span>
              <span className="text-xs font-medium uppercase tracking-wider">
                {readings.rank}
              </span>
              <span className="text-2xl">✠</span>
            </div>
          </div>
        )}
      </div>

      {/* No Print indicator for screen readers */}
      <div className="sr-only no-print">
        Beginning of Mass readings for {readings.liturgicalDate}
      </div>
    </header>
  );
}