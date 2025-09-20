'use client';

import React from 'react';
import { LiturgicalReading } from '@/lib/types';

interface ReadingDisplayProps {
  reading: LiturgicalReading;
  type: 'first' | 'second' | 'psalm' | 'gospel';
  className?: string;
}

export default function ReadingDisplay({
  reading,
  type,
  className = ''
}: ReadingDisplayProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'first':
        return 'First Reading';
      case 'second':
        return 'Second Reading';
      case 'psalm':
        return 'Responsorial Psalm';
      case 'gospel':
        return 'Gospel';
      default:
        return reading.title;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'gospel':
        return 'border-l-liturgical-gold bg-gradient-to-r from-liturgical-gold/5 to-transparent';
      case 'psalm':
        return 'border-l-liturgical-purple bg-gradient-to-r from-liturgical-purple/5 to-transparent';
      default:
        return 'border-l-liturgical-green bg-gradient-to-r from-liturgical-green/5 to-transparent';
    }
  };

  return (
    <article
      className={`
        ${getTypeStyles(type)}
        border-l-4 pl-6 pr-4 py-6 mb-8
        ${className}
      `}
      role="main"
      aria-labelledby={`${type}-title`}
    >
      {/* Reading Header */}
      <header className="mb-6">
        <h2
          id={`${type}-title`}
          className="font-display text-xl font-medium text-text-primary mb-2"
        >
          {getTypeLabel(type)}
        </h2>

        <div className="text-sm text-text-secondary font-medium">
          {reading.citation}
        </div>
      </header>

      {/* Psalm Response (if applicable) */}
      {type === 'psalm' && reading.response && (
        <div className="mb-6 p-4 bg-liturgical-purple/10 rounded-lg border border-liturgical-purple/20">
          <h3 className="text-sm font-medium text-liturgical-purple mb-2 uppercase tracking-wide">
            Response
          </h3>
          <p className="text-liturgical-purple font-medium italic">
            {reading.response}
          </p>
        </div>
      )}

      {/* Reading Text */}
      <div
        className="text-text-primary leading-relaxed"
        style={{
          maxWidth: 'var(--reading-max-width)',
          lineHeight: 'var(--reading-line-height)'
        }}
      >
        {reading.text.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-justify">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Closing for Gospel */}
      {type === 'gospel' && (
        <div className="mt-6 pt-4 border-t border-liturgical-gold/20">
          <p className="text-liturgical-gold font-medium italic text-center">
            The Gospel of the Lord.
          </p>
        </div>
      )}
    </article>
  );
}