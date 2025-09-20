'use client';

import React, { useState } from 'react';
import {
  getLiturgicalSeason,
  formatLiturgicalDateString,
  getCalendarDates
} from '@/lib/liturgical-calendar';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export default function DatePicker({
  selectedDate,
  onDateChange,
  className = ''
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(selectedDate));

  const today = new Date();
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const calendarDates = getCalendarDates(currentYear, currentMonth);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateSelect = (date: Date) => {
    onDateChange(date);
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setViewDate(newDate);
  };

  const navigateToToday = () => {
    setViewDate(new Date());
    onDateChange(new Date());
    setIsOpen(false);
  };

  const isDateInCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth;
  };

  const isSelectedDate = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const getDateButtonClasses = (date: Date) => {
    let classes = 'w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors relative ';

    if (!isDateInCurrentMonth(date)) {
      classes += 'text-text-muted hover:bg-gray-100 ';
    } else if (isSelectedDate(date)) {
      classes += 'bg-liturgical-gold text-white font-medium ';
    } else if (isToday(date)) {
      classes += 'bg-liturgical-green text-white font-medium ';
    } else {
      classes += 'text-text-primary hover:bg-cream ';
    }

    return classes;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Date Picker Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        aria-label="Select date"
        aria-expanded={isOpen}
      >
        <svg
          className="w-5 h-5 text-text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-text-primary">
          {selectedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
        <svg
          className={`w-4 h-4 text-text-secondary transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 p-4 w-80">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="Previous month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h3 className="font-display text-lg font-medium text-text-primary">
                {monthNames[currentMonth]} {currentYear}
              </h3>

              <button
                onClick={() => navigateMonth('next')}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="Next month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Today Button */}
            <div className="mb-4">
              <button
                onClick={navigateToToday}
                className="w-full px-3 py-2 text-sm bg-liturgical-green text-white rounded hover:bg-liturgical-green/90 transition-colors"
              >
                Today
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-xs font-medium text-text-secondary text-center py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDates.map((date, index) => {
                const liturgicalSeason = getLiturgicalSeason(date);
                return (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    className={getDateButtonClasses(date)}
                    title={`${date.toDateString()} • ${liturgicalSeason.name}`}
                    aria-label={`${date.toDateString()} • ${liturgicalSeason.name}`}
                  >
                    {date.getDate()}
                    {/* Liturgical Season Indicator */}
                    {isDateInCurrentMonth(date) && (
                      <div
                        className={`
                          absolute -bottom-0.5 left-1/2 transform -translate-x-1/2
                          w-1 h-1 rounded-full
                          ${liturgicalSeason.color === 'red' ? 'bg-liturgical-red' : ''}
                          ${liturgicalSeason.color === 'gold' ? 'bg-liturgical-gold' : ''}
                          ${liturgicalSeason.color === 'white' ? 'bg-liturgical-white border border-gray-300' : ''}
                          ${liturgicalSeason.color === 'green' ? 'bg-liturgical-green' : ''}
                          ${liturgicalSeason.color === 'purple' ? 'bg-liturgical-purple' : ''}
                          ${liturgicalSeason.color === 'rose' ? 'bg-liturgical-rose' : ''}
                          ${liturgicalSeason.color === 'black' ? 'bg-liturgical-black' : ''}
                        `}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Liturgical Information */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-text-secondary">
                Selected: {formatLiturgicalDateString(selectedDate)}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}