'use client';

import React from 'react';

interface DayNavigationProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  isLoading?: boolean;
  className?: string;
}

export default function DayNavigation({
  currentDate,
  onDateChange,
  isLoading = false,
  className = ''
}: DayNavigationProps) {
  const today = new Date();

  const goToPreviousDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(currentDate.getDate() - 1);
    onDateChange(prevDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    onDateChange(nextDay);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = currentDate.toDateString() === today.toDateString();

  return (
    <nav
      className={`flex items-center justify-between gap-4 ${className}`}
      aria-label="Date navigation"
    >
      {/* Previous Day */}
      <button
        onClick={goToPreviousDay}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 text-text-primary hover:text-liturgical-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous day"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="hidden sm:inline font-medium">Previous</span>
      </button>

      {/* Today Button */}
      {!isToday && (
        <button
          onClick={goToToday}
          disabled={isLoading}
          className="px-4 py-2 text-sm bg-liturgical-green text-white rounded-lg hover:bg-liturgical-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          aria-label="Go to today"
        >
          Today
        </button>
      )}

      {/* Current Date Display (for small screens) */}
      <div className="sm:hidden text-center">
        <div className="text-sm font-medium text-text-primary">
          {currentDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Next Day */}
      <button
        onClick={goToNextDay}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 text-text-primary hover:text-liturgical-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next day"
      >
        <span className="hidden sm:inline font-medium">Next</span>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </nav>
  );
}