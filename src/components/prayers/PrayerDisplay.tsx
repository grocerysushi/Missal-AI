'use client';

import React from 'react';
import { Prayer } from '@/lib/prayers-data';

interface PrayerDisplayProps {
  prayer: Prayer;
  showCategory?: boolean;
  className?: string;
}

export default function PrayerDisplay({
  prayer,
  showCategory = false,
  className = ''
}: PrayerDisplayProps) {
  const getCategoryColor = (category: Prayer['category']) => {
    switch (category) {
      case 'foundational':
        return 'text-liturgical-gold border-liturgical-gold bg-liturgical-gold/5';
      case 'creeds':
        return 'text-liturgical-white border-liturgical-white bg-gray-100';
      case 'devotional':
        return 'text-liturgical-purple border-liturgical-purple bg-liturgical-purple/5';
      case 'acts':
        return 'text-liturgical-green border-liturgical-green bg-liturgical-green/5';
      case 'liturgical':
        return 'text-liturgical-red border-liturgical-red bg-liturgical-red/5';
      default:
        return 'text-liturgical-green border-liturgical-green bg-liturgical-green/5';
    }
  };

  return (
    <article
      className={`
        ${getCategoryColor(prayer.category)}
        border-l-4 pl-6 pr-4 py-6 mb-8
        ${className}
      `}
      role="article"
      aria-labelledby={`prayer-${prayer.id}-title`}
    >
      {/* Prayer Header */}
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h2
            id={`prayer-${prayer.id}-title`}
            className="font-display text-xl font-medium text-text-primary"
          >
            {prayer.title}
          </h2>

          {prayer.latin && (
            <span className="text-sm text-text-secondary italic font-medium bg-cream px-2 py-1 rounded">
              {prayer.latin}
            </span>
          )}

          {showCategory && (
            <span className="text-xs text-text-muted uppercase tracking-wide font-medium">
              {prayer.category.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          )}
        </div>

        {prayer.description && (
          <p className="text-sm text-text-secondary italic mb-4">
            {prayer.description}
          </p>
        )}
      </header>

      {/* Prayer Text */}
      <div
        className="text-text-primary leading-relaxed font-serif"
        style={{
          maxWidth: 'var(--reading-max-width)',
          lineHeight: 'var(--reading-line-height)'
        }}
      >
        {prayer.text.split('\n').map((line, index) => {
          // Handle verses (V./R.) with special formatting
          if (line.startsWith('V.') || line.startsWith('R.')) {
            return (
              <p key={index} className="mb-2 text-liturgical-purple font-medium">
                {line}
              </p>
            );
          }

          // Handle "Let us pray:" with special formatting
          if (line.includes('Let us pray')) {
            return (
              <p key={index} className="mb-3 mt-4 text-text-primary font-semibold">
                {line}
              </p>
            );
          }

          // Regular lines
          if (line.trim()) {
            return (
              <p key={index} className="mb-2">
                {line}
              </p>
            );
          }

          // Empty lines create spacing
          return <div key={index} className="mb-3" />;
        })}
      </div>

      {/* Print-friendly page break */}
      <div className="page-break-after print:block hidden"></div>
    </article>
  );
}