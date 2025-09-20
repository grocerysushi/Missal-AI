'use client';

import React, { useState } from 'react';
import DatePicker from '../navigation/DatePicker';
import DayNavigation from '../navigation/DayNavigation';

interface HeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  isLoading?: boolean;
  className?: string;
}

export default function Header({
  currentDate,
  onDateChange,
  isLoading = false,
  className = ''
}: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const printReadings = () => {
    window.print();
  };

  return (
    <header
      className={`
        bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm
        ${className}
      `}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Catholic Cross Icon */}
              <div className="text-liturgical-gold text-2xl font-bold">
                ✠
              </div>
              <div>
                <h1 className="font-display text-xl font-semibold text-text-primary">
                  Catholic Missal
                </h1>
                <div className="text-xs text-text-secondary hidden sm:block">
                  Daily Readings
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <DayNavigation
              currentDate={currentDate}
              onDateChange={onDateChange}
              isLoading={isLoading}
            />

            <DatePicker
              selectedDate={currentDate}
              onDateChange={onDateChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Print Button */}
            <button
              onClick={printReadings}
              className="p-2 text-text-secondary hover:text-liturgical-gold transition-colors no-print"
              aria-label="Print readings"
              title="Print readings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
            </button>

            {/* Settings/Menu Button */}
            <button
              onClick={toggleSettings}
              className="p-2 text-text-secondary hover:text-liturgical-gold transition-colors md:hidden"
              aria-label="Menu"
              aria-expanded={showSettings}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showSettings && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
            <DayNavigation
              currentDate={currentDate}
              onDateChange={onDateChange}
              isLoading={isLoading}
              className="justify-center"
            />

            <div className="flex justify-center">
              <DatePicker
                selectedDate={currentDate}
                onDateChange={onDateChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-liturgical-gold via-liturgical-green to-liturgical-gold animate-pulse"></div>
      )}
    </header>
  );
}